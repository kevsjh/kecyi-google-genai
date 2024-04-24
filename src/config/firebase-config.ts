import { getApp, getApps, initializeApp, } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
    browserLocalPersistence,
    connectAuthEmulator,
    getAuth,
    inMemoryPersistence,
    setPersistence,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";


const defaultFirebase = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};


function getAuthEmulatorHost(hostAddress: string) {
    // we can access these variables
    // because they are prefixed with "NEXT_PUBLIC_"
    const host = hostAddress;
    const port = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT;
    return ["http://", host, ":", port].join("");
}
const persistence = typeof window !== "undefined"
    ? browserLocalPersistence
    : // browserLocalPersistence
    // browserSessionPersistence
    inMemoryPersistence;


const app = getApps().length > 0 ? getApp() : initializeApp({
    ...defaultFirebase,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
});
const firebaseAuth = getAuth(app);
const firebaseFirestore = getFirestore(app);

const defaultFirebaseStorage = getStorage(app);


setPersistence(firebaseAuth, persistence);

const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);


const shouldConnectEmulator = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === ('TRUE' || 'true') ?
    true : false;
// process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === 'TRUE';
if (shouldConnectEmulator) {

    const hostAddress = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST!;
    const authHost = getAuthEmulatorHost(hostAddress);

    connectAuthEmulator(firebaseAuth, authHost, { disableWarnings: true });
    connectFirestoreEmulator(
        firebaseFirestore,
        hostAddress,
        Number(process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_PORT)
    );
    connectStorageEmulator(
        defaultFirebaseStorage,
        hostAddress,
        Number(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_PORT)
    );

}





export {
    firebaseAuth,
    firebaseFirestore,
    defaultFirebaseStorage,
    getFunctions,
    analytics,
    app,
    defaultFirebase,

}