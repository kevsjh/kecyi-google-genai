import { GoogleAuth } from 'google-auth-library';


export async function getGoogleAccessToken() {

    const auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        credentials: {
            "client_email": process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            "private_key": process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/gm, "\n"),
            "universe_domain": "googleapis.com"
        }
    });
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    return accessToken.token;
}
