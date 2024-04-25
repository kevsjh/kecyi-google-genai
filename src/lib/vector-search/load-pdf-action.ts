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

import { IdDocument, } from "@langchain/community/vectorstores/googlevertexai";
import { } from "@langchain/core/documents";
import { GoogleCloudStorageDocstore } from "langchain/stores/doc/gcs";
import { upsertVectorStore } from "./upsert-vector-store";




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

        const loader = new PDFLoader(inputFilePath,);
        const docs: IdDocument[] = await loader.load();
        // update metadata from standard pdf loader
        // use vector store doc type to set doc id
        docs.forEach((doc: IdDocument) => {
            // serialized doc metadata
            const title = doc.metadata?.pdf?.info?.Title ?? ''
            const pageNumber = doc.metadata?.loc?.pageNumber ?? ''
            const docId = doc.id ?? uuidv4()
            doc.id = docId
            doc.metadata = {
                id: docId,
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
        const { status, datapointIdList, error } = await upsertVectorStore({
            inputDocs: docs

        })
        if (!status || error) {
            console.error('Error in upsertVectorStore', error ?? 'Something went wrong. Please try again later.')

            return {
                status: false,
                error: error ?? 'Something went wrong. Please try again later.'
            }
        }



        await contentDocRef.set({
            id: contentDocId,
            uid,
            createdAt: new Date(),
            objectFullPath,
            objectURL,
            datapointIdList,
            userFilename,
            type: 'pdf',
            viewStatus: true,
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