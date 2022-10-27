import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "../../lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import router from "next/router";

export const useGoogleLogin = async (): Promise<void> => {
	try {
		const auth = getAuth();
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
		const user = auth.currentUser;
		const docRef = doc(db, "users", user.uid);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			await setDoc(docRef, {
				name: user.providerData[0].displayName,
				email: user.providerData[0].email,
				userImg: user.providerData[0].photoURL,
				uid: user.uid,
				createTime: serverTimestamp(),
				updateTime: serverTimestamp(),
				username: user.providerData[0].displayName
					.split(" ")
					.join("")
					.toLocaleLowerCase(),
			});
		}
		router.push("/");
	} catch (error) {
		alert(error);
	}
};
