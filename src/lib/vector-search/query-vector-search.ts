'use server'

import { GoogleVertexAIEmbeddings } from "@langchain/community/embeddings/googlevertexai";
import { getGoogleAccessToken } from "../auth/access-token";


export default async function queryVectorSearch({ query, uid, allowDefaultQuery = true }: { query: string, uid: string, allowDefaultQuery?: boolean }) {
    const accessToken = await getGoogleAccessToken();
    if (!accessToken) {
        console.error('Failed to get access token in upsertVectorStore')
        return {
            status: false,
            error: 'Something went wrong. Please try again later.'
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
                error: 'Something went wrong. Please try again later.'
            }
        }
        const { nearestNeighbors } = await response.json()

        if (nearestNeighbors?.length === 0) {
            return {
                status: false,


            }
        }

        const nearestNeighbor = nearestNeighbors[0]

        const result: { datapointId: string, distance: number }[] = nearestNeighbor.neighbors.map((neighbor: any) => {
            return {
                datapointId: neighbor?.datapoint?.datapointId,
                distance: neighbor?.distance
            }
        })

        // console.log('json', json)
        return {
            status: true,
            data: result
        }



    } catch (err) {
        console.error('Error in queryVectorSearch', err)
        return {
            status: false,
            error: 'Something went wrong. Please try again later.'
        }
    }


}