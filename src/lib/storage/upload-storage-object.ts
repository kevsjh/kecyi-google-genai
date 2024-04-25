import { getStorage, ref, uploadBytesResumable, getDownloadURL, UploadMetadata } from "firebase/storage";

import { nanoid } from 'nanoid'

import { defaultFirebaseStorage, } from "@/config/firebase-config";


export async function uploadPDFObject({ selectedFile, uid }: { selectedFile: File, uid: string }) {
    try {
        const nanoId = nanoid()
        const userFilename = selectedFile.name
        // get filename
        // get file extension
        const fileExtension = selectedFile.name.split(".").pop();

        const appendFileExtension = fileExtension ? "." + fileExtension : 'pdf'

        const filename = 'user_pdf' + "_" + nanoId
        //     const uploadTask = uploadBytesResumable(storageRef, file);
        // staticFirebaseBucketStorage

        const metadata: UploadMetadata = {
            contentType: 'application/pdf',
            contentDisposition: `inline; filename=${selectedFile.name}`,
            customMetadata: {
                filename: selectedFile.name,
                userFilename: selectedFile.name,
                contentType: 'application/pdf',
                uid
            }
        }

        const fileRef = ref(defaultFirebaseStorage, `pdf/${filename}${appendFileExtension}`)
        const uploadTask = uploadBytesResumable(fileRef, selectedFile, metadata);
        await uploadTask
        const objectFullPath = fileRef.fullPath
        const objectURL = await getDownloadURL(fileRef)

        return {
            objectFullPath,
            objectURL
        }


    } catch (err) {
        console.error('Error uploading image', err)
        return {
            objectFullPath: undefined,
            objectURL: undefined
        }
    }
}
