'use server'

import { firebaseAdminDefaultBucket, firebaseAdminFirestore, initFirebaseAdminApp } from "@/config/firebase-admin-config"
import { v4 as uuidv4 } from 'uuid';
import { IdDocument, } from "@langchain/community/vectorstores/googlevertexai";
import { compile } from "html-to-text";
import { upsertVectorStore } from "./upsert-vector-store";
import { RecursiveUrlLoader } from "langchain/document_loaders/web/recursive_url";
import { convertWebURLPDF } from "./convert-url-pdf";


// import { WebPDFLoader } from "langchain/document_loaders/web/pdf";

initFirebaseAdminApp()


async function validateURL(inputURL: string): Promise<boolean> {
    try {
        // Validate URL format
        const url = inputURL.startsWith("http") ? inputURL : `https://${inputURL}`
        try {
            new URL(url);

        } catch (_) {
            return false; // Invalid URL format
        }
        // Create a promise that resolves after 15 seconds
        const timeoutPromise = new Promise<boolean>((resolve) => {
            setTimeout(() => {
                resolve(false); // Resolving with false after 15 seconds
            }, 15000); // 15 seconds in milliseconds
        });

        // Fetch the URL
        const fetchPromise = fetch(url).then(response => response.ok);

        // Race between the fetch promise and the timeout promise
        const result = await Promise.race([fetchPromise, timeoutPromise]);

        return result as boolean; // Cast result to boolean
    } catch (err) {
        console.error('Error in validateURL', err)
        return false

    }
}


export async function loadWebURLAction({ webURL, uid }: { uid: string, webURL: string }) {


    const url = webURL.startsWith("http") ? webURL : `https://${webURL}`


    const validURL = await validateURL(url)

    if (!validURL) {
        return {
            status: false,
            error: 'Invalid URL'
        }
    }

    const contentDocRef = firebaseAdminFirestore.collection('contents').doc()
    const contentDocId = contentDocRef.id

    try {





        const compiledConvert = compile({
            wordwrap: 130,

        });
        const loader = new RecursiveUrlLoader(webURL, {
            extractor: compiledConvert,
            // this is in unit seconds By default, it is set to 10000 (10 seconds).
            timeout: 15000,
            maxDepth: 0,
            preventOutside: true,
            callerOptions: {
                maxConcurrency: 32,
                maxRetries: 3,
            }
        });

        const docs: IdDocument[] = await loader.load();
        // update metadata from standard pdf loader
        // use vector store doc type to set doc id
        docs.forEach((doc: IdDocument) => {
            // serialized doc metadata

            const docId = doc.id ?? uuidv4()
            doc.id = docId
            doc.metadata = {
                id: docId,
                source: webURL,
                title: webURL,
                uid: uid,
                contentDocId,
                filename: webURL
            }
        })


        const promiseTasks = await Promise.all([
            upsertVectorStore({
                inputDocs: docs
            }),
            convertWebURLPDF({
                objectId: contentDocId,
                uid,
                webURL
            })
        ])

        const { status, datapointIdList, error } = promiseTasks[0]

        const {
            objectFullPath, objectURL
        } = promiseTasks[1]



        if (!status || error) {
            console.error('Error in upsertVectorStore', error ?? 'Something went wrong. Please try again later.')

            return {
                status: false,
                error: error ?? 'Something went wrong. Please try again later.'
            }
        }

        // remember to convert web to pdf

        await contentDocRef.set({
            id: contentDocId,
            uid,
            createdAt: new Date(),
            objectFullPath,
            objectURL,
            datapointIdList,
            userFilename: webURL,
            webURL,
            type: 'web',
            viewStatus: true,
        })

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