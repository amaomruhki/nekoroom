import { useState } from "react";
import { useRouter } from "next/router";
import {
	getAuth,
	GoogleAuthProvider,
	sendPasswordResetEmail,
	signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

//googleアカウントでログイン、新規の場合はユーザーデータをuserコレクションへ追加
export const useGoogleLogin = async (): Promise<void> => {
	try {
		const auth = getAuth();
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
		const user = auth.currentUser;
		if (user) {
			const docRef = doc(db, "users", user.uid);
			const docSnap = await getDoc(docRef);
			if (!docSnap.exists()) {
				await setDoc(docRef, {
					name: user.providerData[0].displayName,
					email: user.providerData[0].email,
					userImg: user.providerData[0].photoURL,
					uid: user.uid,
					text: "",
					createTime: serverTimestamp(),
					updateTime: serverTimestamp(),
					username: user.providerData[0]
						.displayName!.split(" ")
						.join("")
						.toLocaleLowerCase(),
				});
			}
			window.location.href = "/";
		}
	} catch (error) {
		alert(error);
	}
};

// パスワードリセットメールをfirebaseから送信
export const usePasswordReset = () => {
	const router = useRouter();
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(null);
	const auth = getAuth();

	const passwordReset = (email: string) => {
		sendPasswordResetEmail(auth, email)
			.then(() => {
				setSuccess(true);
				setTimeout(() => {
					router.push("/auth/login");
				}, 10000);
			})
			.catch((err) => {
				console.log(err.message);
				setError(err.message);
			});
	};
	return { success, error, passwordReset };
};
