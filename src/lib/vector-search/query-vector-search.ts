'use server'



import { GoogleVertexAIEmbeddings } from "@langchain/community/embeddings/googlevertexai";
import { getGoogleAccessToken } from "../auth/access-token";
import { GoogleCloudStorageDocstore } from "langchain/stores/doc/gcs";
import { Document } from "@langchain/core/documents";


async function retrieveDocStore({ datapointIdList }: { datapointIdList: string[] }) {
    try {

        const docStore = new GoogleCloudStorageDocstore({
            bucket: process.env.GOOGLE_CLOUD_DOC_STORE_BUCKET_NAME!,
            prefix: 'docstore/'
        },);

        // retrieve child doc parallely
        const retrieveDocTask: Promise<Document<Record<string, any>>>[] = []
        datapointIdList.forEach((datapointId) => {
            retrieveDocTask.push(docStore.search(datapointId))

        })

        const retrieveContents: string[] = []

        const retrieveDocs = await Promise.all(retrieveDocTask)

        const parentDocIdList: string[] = []

        retrieveDocs.forEach((doc) => {
            // check if the doc has parentDocId
            if (doc?.metadata?.parentDocId?.length > 0) {
                // check if the parentDocId already exists in the list, if not add it
                // we do not need duplicated parent documents
                if (parentDocIdList.indexOf(doc.metadata.parentDocId) === -1) {
                    parentDocIdList.push(doc.metadata.parentDocId)
                }
            } else {
                retrieveContents.push(doc.pageContent)
            }
        })



        // get content from parentDoc parallely
        const retrieveParentDocTask: Promise<Document<Record<string, any>>>[] = []
        parentDocIdList.forEach((parentDocId) => {
            retrieveParentDocTask.push(docStore.search(parentDocId))
        })
        const retrieveParentDocs = await Promise.all(retrieveParentDocTask)

        // push the content of parentDoc to retrieveContents
        retrieveParentDocs.forEach((doc) => {
            retrieveContents.push(doc.pageContent)
        })

        // convert retrieveContents to string with \n delimiter
        const context = retrieveContents.join('\n')
        return context
    } catch (err) {
        console.error('Error in retrieveDocStore', err)
        return ''
    }
}


export default async function queryVectorSearch({ query, uid, allowDefaultQuery = true, minScore }: { query: string, uid: string, allowDefaultQuery?: boolean, minScore?: number }) {
    const accessToken = await getGoogleAccessToken();
    if (!accessToken) {
        console.error('Failed to get access token in upsertVectorStore')
        return {
            status: false,
            error: 'Something went wrong. Please try again later.',
            retrievedContext: '',
        }
    }

    const url = `https://${process.env.GOOGLE_VERTEXAI_VECTOR_SEARCH_API_ENDPOINT}/${process.env.GOOGLE_VERTEXAI_API_VERSION}/projects/${process.env.GOOGLE_VERTEXAI_PROJECT_ID}/locations/${process.env.GOOGLE_VERTEXAI_LOCATION}/indexEndpoints/${process.env.GOOGLE_VERTEXAI_MATCHINGENGINE_INDEXENDPOINT}:findNeighbors`;

    try {
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


        const featureVectors: number[] = await embeddingModel.embedQuery(query);


        const datapoint = {
            'featureVector': featureVectors,
            "restricts": [{
                "namespace": "uid",
                "allowList": [uid, ...(allowDefaultQuery ? ['all'] : [])],
                "denyList": []
            }]
        }

        const response = await fetch(
            url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                deployedIndexId: process.env.GOOGLE_VERTEXAI_VECTOR_SEARCH_DEPLOYED_INDEX_ID,
                queries: [{
                    datapoint: datapoint
                }]
            })
        })

        if (response.status !== 200) {
            console.error('Error in queryVectorSearch', response.status, response.statusText)
            return {
                status: false,
                error: 'Something went wrong. Please try again later.',
                retrievedContext: '',
            }
        }
        const { nearestNeighbors } = await response.json()

        if (nearestNeighbors?.length === 0) {
            return {
                status: false,
                retrievedContext: '',
            }
        }

        const nearestNeighbor = nearestNeighbors[0]

        let finalResult: { datapointId: string, distance: number }[]

        const result: { datapointId: string, distance: number }[] = nearestNeighbor.neighbors.map((neighbor: any) => {
            return {
                datapointId: neighbor?.datapoint?.datapointId,
                distance: neighbor?.distance
            }
        })

        if (minScore !== undefined) {
            // filter out datapoint with distance less than minScore
            finalResult = result.filter((res) => res.distance >= minScore)
        } else {
            finalResult = result
        }



        console.log('resuklt', finalResult)

        // get datapointIdList
        const datapointIdList = finalResult.map((res) => res.datapointId)



        // retrieve text content with retrieved datapointIdList
        // parent child retrieval is handled in retrieveDocStore
        const context = await retrieveDocStore({
            datapointIdList
        })

        return {
            status: true,
            data: finalResult,
            retrievedContext: context
        }

    } catch (err) {
        console.error('Error in queryVectorSearch', err)
        return {
            status: false,
            error: 'Something went wrong. Please try again later.',
            retrievedContext: '',
        }
    }


}