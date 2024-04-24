import type { AppOptions } from "firebase-admin/app";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from 'firebase-admin/storage';

const firebaseAdminConfig: AppOptions = {

  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  }),
  storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET,
}

if (getApps().length <= 0) {
  // connec to local emulator
  // if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  //   // for auth
  //   process.env['FIREBASE_AUTH_EMULATOR_HOST'] = process.env.FIREBASE_AUTH_EMULATOR_HOST;
  // }
  initializeApp(firebaseAdminConfig);
  getFirestore().settings({ ignoreUndefinedProperties: true });
}





function initFirebaseAdminApp() {
  if (getApps().length <= 0) {
    // if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    //   // for auth
    //   process.env['FIREBASE_AUTH_EMULATOR_HOST'] = process.env.FIREBASE_AUTH_EMULATOR_HOST;
    //   // for emulator
    //   // process.env['FIRESTORE_EMULATOR_HOST'] = '127.0.0.1:1956';
    // }
    initializeApp(firebaseAdminConfig);
    getFirestore().settings({ ignoreUndefinedProperties: true });
  }

}

const firebaseAdminAuth = getAuth()
const firebaseAdminFirestore: FirebaseFirestore.Firestore = getFirestore()
const firebaseAdminStorage = getStorage()
const firebaseAdminDefaultBucket = firebaseAdminStorage.bucket(process.env.FIREBASE_ADMIN_STORAGE_BUCKET)


export {
  firebaseAdminAuth,
  initFirebaseAdminApp,
  firebaseAdminFirestore,
  firebaseAdminStorage,
  firebaseAdminDefaultBucket
  // firebaseAdminBucket,
}


