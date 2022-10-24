import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "../lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import router from "next/router";

export const useGoogleLogin = async (): Promise<void> => {
	try {
		const auth = getAuth();
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
		const user = auth.currentUser.providerData[0];
		const docRef = doc(db, "users", user.uid);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			await setDoc(docRef, {
				name: user.displayName,
				email: user.email,
				userImg: user.photoURL,
				uid: user.uid,
				timestamp: serverTimestamp(),
				username: user.displayName.split(" ").join("").toLocaleLowerCase(),
			});
		}
		router.push("/");
	} catch (error) {
		alert(error);
	}
};
