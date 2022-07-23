import firebase from "firebase/app";
import firebaseConfig from "../../config/firebase-config";
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth'

firebase.initializeApp(firebaseConfig);

// Make the firebase API available to our pages.
export const db = firebase.firestore();
export const storage = firebase.storage();
export const storageRef = storage.ref();
export const auth = firebase.auth();
export const authProvider = new firebase.auth.GoogleAuthProvider();

// If we're on localhost, then use the local emulator instead of the production database.
if (window.location.hostname === "172.16.21.254") {
    auth.useEmulator("http://172.16.21.254:9099", { disableWarnings: true });
    storage.useEmulator("172.16.21.254", 9199);
    db.useEmulator("172.16.21.254", 9299);
}
