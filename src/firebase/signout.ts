
import firebase_app from "../../config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);


export const signOut = async () => {
    await auth.signOut();
};