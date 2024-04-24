'use server'

import * as os from "os";
import * as path from "path";
import { mkdirp } from 'mkdirp'
import * as fs from "fs";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { firebaseAdminDefaultBucket, firebaseAdminFirestore, initFirebaseAdminApp } from "@/config/firebase-admin-config"
import { nanoid } from "nanoid";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { v4 as uuidv4 } from 'uuid';
import { GoogleVertexAIEmbeddings } from "@langchain/community/embeddings/googlevertexai";
import { IdDocument, MatchingEngine } from "@langchain/community/vectorstores/googlevertexai";
import { } from "@langchain/core/documents";
import { GoogleCloudStorageDocstore } from "langchain/stores/doc/gcs";
import { upsertVectorStore } from "./upsert-vector-store";
import queryVectorSearch from "./query-vector-search";



// import { WebPDFLoader } from "langchain/document_loaders/web/pdf";

initFirebaseAdminApp()

export async function loadPDFAction({ objectFullPath, objectURL, uid }: { uid: string, objectFullPath: string, objectURL: string }) {


    const contentDocRef = firebaseAdminFirestore.collection('contents').doc()
    const contentDocId = contentDocRef.id

    try {
        const inputFilePath = path.join(os.tmpdir(), nanoid() + `.pdf`);
        const tempLocalDir = path.dirname(inputFilePath);
        await mkdirp(tempLocalDir);

        const fileRef = firebaseAdminDefaultBucket.file(objectFullPath);

        const dlRes = await Promise.all([
            fileRef.download({ destination: inputFilePath }),

            fileRef.getMetadata()
        ])
        const [metadata] = dlRes[1]
        const customMetadata = metadata.metadata

        const userFilename = customMetadata?.filename

        const loader = new PDFLoader(inputFilePath, {

        });
        const docs: IdDocument[] = await loader.load();
        // update metadata from standard pdf loader
        // use vector store doc type to set doc id
        docs.forEach((doc: IdDocument) => {
            // serialized doc metadata
            const title = doc.metadata?.pdf?.info?.Title ?? ''
            const pageNumber = doc.metadata?.loc?.pageNumber ?? ''
            doc.id = doc.id ?? uuidv4()
            doc.metadata = {
                id: doc.id,
                source: objectFullPath,
                title: title,
                objectURL: objectURL,
                objectFullPath: objectFullPath,
                pageNumber: pageNumber,
                uid: customMetadata?.uid,
                contentType: customMetadata?.contentType,
                contentDocId,
                filename: userFilename
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

        const docStore = new GoogleCloudStorageDocstore({
            bucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET!,
            prefix: 'docstore'
        });



        const parentDocs = await parentSplitter.splitDocuments(docs);


        const { status, datapointIdList, error } = await upsertVectorStore({
            inputDocs: parentDocs

        })
        if (!status || error) {
            console.error('Error in upsertVectorStore', error ?? 'Something went wrong. Please try again later.')

            return {
                status: false,
                error: error ?? 'Something went wrong. Please try again later.'
            }
        }


        const { status: queryStatus, data, error: queryError } = await queryVectorSearch({
            query: 'github',
            uid: uid,
            allowDefaultQuery: true,
        })

        await contentDocRef.set({
            id: contentDocId,
            uid,
            createdAt: new Date(),
            objectFullPath,
            objectURL,
            datapointIdList,
            userFilename
        })


        fs.unlinkSync(inputFilePath);

        return {
            status: true,

        }

    } catch (err) {
        console.error('Error loading pdf', err)
        return {
            status: false,
            error: 'Something went wrong. Please try again later.'
        }
    }

}