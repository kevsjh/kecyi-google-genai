'use server'


import { getGoogleAccessToken } from "../auth/access-token"

export default async function speechToTextRequest({ base64Audio }: { base64Audio: string }) {

    try {
        const accessToken = await getGoogleAccessToken()
        if (!accessToken) {

            throw new Error('Failed to get access token')
        }

        const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                config: {
                    "languageCode": "en-US",
                    // "sampleRateHertz": 48000,
                    "enableWordTimeOffsets": true,
                    // "enableWordConfidence": true,
                    // "model": "default",
                    // "encoding": "WEBM_OPUS",
                    // "sampleRateHertz": 16000,
                    // "audioChannelCount": 1
                },
                audio: {
                    content: base64Audio
                }
            })
        })


        if (response.status !== 200) {
            const json = await response.json()

            console.error(`Error in speechToTextRequest`, json)

            return {
                error: 'Something went wrong. Please try again later.',
                text: ''
            }
        }

        const json = await response.json()
        const { results } = json

        if (results === undefined || results.length === 0) {
            console.log('Speech to text, no results')
            return {
                text: ''
            }
        }
        const result = results[0]
        // console.log('results', results?.alternatives[0].transcript)
        if (result?.alternatives === undefined || result?.alternatives.length === 0) {

            return {
                text: ''
            }
        }
        const transcript = result.alternatives[0].transcript
        const confidence = result.alternatives[0].confidence

        return {
            text: transcript,
            confidence: confidence
        }




    } catch (err) {
        console.error(`Error in speechToTextRequest: ${err}`)
        return {
            error: 'Something went wrong. Please try again later.',
            text: ''
        }
    }
}