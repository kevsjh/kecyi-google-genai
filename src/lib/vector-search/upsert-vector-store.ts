'use server'

import { GoogleVertexAIEmbeddings } from "@langchain/community/embeddings/googlevertexai";
import type { IdDocument, Restriction, } from "@langchain/community/vectorstores/googlevertexai";
import { v4 as uuidv4 } from 'uuid';
import { getGoogleAccessToken } from "../auth/access-token";
import { VectorStoreDocumentDataPoint } from "./vector-search-class";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { addDocumentsToDocStoreParallel } from "./insert-doc-store-storage";

const maximumParallelAPIRequest = 50

export interface IVectorStoreDatapoint {
    datapoint_id: string;
    feature_vector: number[];
    restricts: Restriction[] | undefined;
}


async function upsertDatapointVectorStoreRequestWithRetry({
    googleAccessToken,
    datapointsList,
    maxRetries = 6,
    currentIteration = '',


}: {
    googleAccessToken: string,
    datapointsList: IVectorStoreDatapoint[],
    maxRetries?: number,
    currentIteration?: string,


}): Promise<boolean> {
    let retries = 0;


    // if getting error 400, check embedding dimension length
    const url = `https://${process.env.GOOGLE_VERTEXAI_API_ENDPOINT}/${process.env.GOOGLE_VERTEXAI_API_VERSION}/projects/${process.env.GOOGLE_VERTEXAI_PROJECT_ID}/locations/${process.env.GOOGLE_VERTEXAI_LOCATION}/indexes/${process.env.GOOGLE_VERTEXAI_MATCHINGENGINE_INDEX}:upsertDatapoints`;


    while (retries < maxRetries) {
        try {

            const response = await fetch(
                url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${googleAccessToken}`,
                },
                body: JSON.stringify({
                    datapoints: datapointsList
                })
            }
            )
            if (response.status === 200) {
                return true;
            }
            // early exit for non rate limit error
            if (response.status !== 429) {

                console.error('Error in upsertDatapointVectorStoreRequestWithRetry', response.status)
                return false
            }

        } catch (err: any) {
            console.error(`Error in upsertDatapointVectorStoreRequestWithRetry ${currentIteration}`, err)
        }
        const delayMs = Math.pow(2, retries) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        retries++;
    }

    // throw new Error("Exceeded maximum number of retries");
    return false
}


export async function upsertVectorStore({ inputDocs }: { inputDocs: IdDocument[] }) {
    try {

        inputDocs.forEach((doc) => {
            const docId = doc.id ?? uuidv4()
            doc.id = docId
            doc.metadata = {
                ...doc.metadata,
                id: docId,
            }
        })


        // apply parent child retrieval (smaller chunk in vector search for better accuracy, leverage on parent for sufficient context)
        // parent splitter (split doc to medium chunk)
        const parentSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,

        });
        // child splliter (split to smaller chunk, this provide better accuracy for vector)
        const childSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 300,
            chunkOverlap: 100,

        });

        const parentDocs: IdDocument[] = await parentSplitter.splitDocuments(inputDocs);

        parentDocs.forEach((doc) => {
            const docId = doc.id ?? uuidv4()
            doc.id = docId
            doc.metadata = {
                ...doc.metadata,
                id: docId,
            }
        })


        const childDocs: IdDocument[] = await childSplitter.splitDocuments(parentDocs);

        // apply metadata and new id to child docs
        childDocs.forEach((doc: IdDocument) => {
            const parentDocId = doc.metadata?.id;
            // create new id for each child doc
            const newChildDocId = uuidv4()
            doc.id = newChildDocId
            doc.metadata = {
                ...doc.metadata,
                id: newChildDocId,
                parentDocId: parentDocId,
            }
        })

        const embeddingModel = new GoogleVertexAIEmbeddings({
            maxConcurrency: 50,
            maxRetries: 6,
            endpoint: 'asia-southeast1-aiplatform.googleapis.com',
            model: 'textembedding-gecko@003',
            location: process.env.GOOGLE_VERTEXAI_LOCATION,
            authOptions: {
                scopes: ['https://www.googleapis.com/auth/cloud-platform'],
                projectId: process.env.GOOGLE_VERTEXAI_PROJECT_ID,
                credentials: {
                    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
                    type: 'service_account',
                    "client_email": process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
                    "private_key": process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/gm, "\n"),
                }
            },
        });

        // embed text

        const textsToEmbed: string[] = childDocs.map((doc) => doc.pageContent);
        const embeddingVectors: number[][] = await embeddingModel.embedDocuments(textsToEmbed);

        if (embeddingVectors.length !== childDocs.length) {
            return {
                datapointIdList: undefined,
                status: false,
                error: 'Error in upsertVectorStore, embeddingVectors length does not match inputDocs length'
            }
        }
        const accessToken = await getGoogleAccessToken();
        if (!accessToken) {
            console.error('Failed to get access token in upsertVectorStore')
            return {
                status: false,
                error: 'Something went wrong. Please try again later.'
            }
        }

        // generate datapoint and restricts
        const vectorSearchDocumentDatapoints = embeddingVectors.map((vector, idx) => {
            const vectorStoreDataPoint = new VectorStoreDocumentDataPoint(childDocs[idx])
            return vectorStoreDataPoint.buildDatapoint(vector)
        });
        const datapoints: IVectorStoreDatapoint[] = vectorSearchDocumentDatapoints.map((datapoint) => {
            return {
                datapoint_id: datapoint.datapointId,
                feature_vector: datapoint.featureVector,
                restricts: datapoint.restricts
            }
        })

        const datapointIdList = datapoints.map((datapoint) => {
            return datapoint.datapoint_id
        })


        // chunk upsert task to smaller pieces
        // limitation on vector search if too many datapoints are upserted at once
        const chunkDatapointsUpsert: IVectorStoreDatapoint[][] = []
        for (let i = 0; i < datapoints.length; i += 30) {
            const requestDatapoints: IVectorStoreDatapoint[] = []

            for (let ii = i; ii < Math.min(i + 40, datapoints.length); ii++) {
                const datapoint = datapoints[ii];
                requestDatapoints.push(datapoint)
                // assume documentListWithId is the same length as documents
            }
            chunkDatapointsUpsert.push(requestDatapoints)
        }
        // perform chunk upsert on parallel requests
        for (let i = 0; i < chunkDatapointsUpsert.length; i += maximumParallelAPIRequest) {
            const upsertPromiseTask: Promise<boolean>[] = []

            for (let ii = i;
                ii < Math.min(i + maximumParallelAPIRequest, chunkDatapointsUpsert.length);
                ii++) {
                upsertPromiseTask.push(upsertDatapointVectorStoreRequestWithRetry({
                    googleAccessToken: accessToken,
                    datapointsList: chunkDatapointsUpsert[ii],
                    maxRetries: 1,
                    currentIteration: `current loop ${ii}`
                }))
            }
            // send parallel requests
            const response = await Promise.all(upsertPromiseTask)
            // check if all requests are successful

            // early exit if any of the request failed
            if (response.includes(false)) {
                console.error('Error in upsertVectorStore, failed to upsert all datapoints')
                return {
                    status: false,
                    error: 'Something went wrong, please try again later.'
                }
            }
        }

        // upload both parent and child doc to doc store
        await Promise.all([
            addDocumentsToDocStoreParallel({ docs: parentDocs }),
            addDocumentsToDocStoreParallel({ docs: childDocs }),
        ])


        return {
            status: true,
            datapointIdList
        }


    } catch (err) {
        console.error('Error in upsertVectorStore', err)
        return {
            datapointIdList: undefined,
            status: false,
            error: 'Error in upsertVectorStore'
        }
    }

}