'use server'

import * as os from "os";
import * as path from "path";
import { mkdirp } from 'mkdirp'
import * as fs from "fs";
import { getGoogleIdToken } from "../auth/access-token";
import { pipeline } from 'stream/promises';
import { uploadPDFObjectToStorage } from "./insert-doc-store-storage";
import axios from "axios";
const FormData = require('form-data');


export async function convertWebURLPDF({

    landscape,
    webURL,
    uid,
    objectId

}: {

    webURL: string
    landscape?: boolean,
    uid: string,
    objectId: string


}) {
    // set tmp output file path
    const url = process.env.GOTENBERG_CHROMIUM_CLOUD_RUN_URL

    if (!url || url?.length === 0) {
        return {
            objectFullPath: undefined, objectURL: undefined
        }
    }
    let retries = 0;


    const convertedOutputFilePath = path.join(os.tmpdir(), webURL + '.pdf');
    const tempOutputLocalDir = path.dirname(convertedOutputFilePath);
    await mkdirp(tempOutputLocalDir);
    try {
        const token = await getGoogleIdToken({ url })


        const form = new FormData();
        form.append('url', webURL)
        if (landscape) {
            form.append('landscape', 'true');
        }

        const response = await axios.post(
            `${url}/forms/chromium/convert/url`,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    'X-Serverless-Authorization': `Bearer ${token}`
                },
                responseType: 'stream'
            }
        );


        if (response.status !== 200) {
            throw new Error('Failed to convert URL to PDF')
        }


        const pdfFilePath = convertedOutputFilePath; // Specify the path to save the PDF file
        const writer = fs.createWriteStream(pdfFilePath); // Create a write stream to save the PDF
        await pipeline(response.data, writer);

        const {
            objectFullPath, objectURL
        } = await uploadPDFObjectToStorage({
            inputObject: pdfFilePath,
            uid,
            webURL,
            objectId: objectId
        })

        console.log('objectFullPath', objectFullPath)

        fs.unlinkSync(pdfFilePath);

        return {
            objectFullPath, objectURL
        }
    } catch (err) {

        console.error('Error in convertWebpageUrlPDF', err)
        return {
            objectFullPath: undefined, objectURL: undefined
        }

    }

}
