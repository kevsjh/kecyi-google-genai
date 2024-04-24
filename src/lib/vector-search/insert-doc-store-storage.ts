import { IdDocument } from "@langchain/community/vectorstores/googlevertexai";
import { GoogleCloudStorageDocstore } from "langchain/stores/doc/gcs";
import { v4 as uuidv4 } from 'uuid';

const chunkUploadDocStore = 50

export async function addDocumentsToDocStoreParallel({ docs }: { docs: IdDocument[] }) {
    try {
        const docStore = new GoogleCloudStorageDocstore({
            bucket: process.env.GOOGLE_CLOUD_DOC_STORE_BUCKET_NAME!,
            prefix: 'docstore/'
        },);

        for (let i = 0; i < docs.length; i += chunkUploadDocStore) {
            const uploadPromiseTasks = []
            for (let ii = i; ii < Math.min(i + chunkUploadDocStore, docs.length); ii++) {
                const doc = docs[ii]
                const docId = doc.id
                const metadataId = doc.metadata.id
                if (metadataId !== docId) {
                    doc.id = metadataId
                }

                const id = metadataId ?? docId ?? doc.id ?? uuidv4()
                // uploadPromiseTasks.push(docStore.addDocument(doc.id ?? uuid.v4(), doc))
                uploadPromiseTasks.push(docStore.addDocument(id, doc))
            }
            await Promise.allSettled(uploadPromiseTasks)
        }
        return
    } catch (err) {
        console.error('Error in addDocumentsToDocStoreParallel', err)
        return

    }
}