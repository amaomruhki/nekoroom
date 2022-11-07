import {
	getAuth,
	signInWithRedirect,
	signOut,
	GoogleAuthProvider,
	onAuthStateChanged,
	sendPasswordResetEmail,
} from "firebase/auth";
import { app } from "../../../../lib/firebase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { UserState, userState } from "../../../Atoms/userAtom";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const googleLogin = (): Promise<void> => {
	const provider = new GoogleAuthProvider();
	const auth = getAuth(app);
	return signInWithRedirect(auth, provider);
};

export const googleLogout = (): Promise<void> => {
	const auth = getAuth(app);
	return signOut(auth);
};

export const useAuth = (): boolean => {
	const [isLoading, setIsLoading] = useState(true);
	const setUser = useSetRecoilState(userState);

	useEffect(() => {
		const auth = getAuth(app);
		return onAuthStateChanged(auth, (user) => {
			setUser(user);
			setIsLoading(false);
		});
	}, [setUser]);

	return isLoading;
};

export const useUser = (): UserState => {
	return useRecoilValue(userState);
};

export const usePasswordReset = () => {
	const router = useRouter();
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(null);
	const auth = getAuth(app);

	const passwordReset = (email: string) => {
		sendPasswordResetEmail(auth, email)
			.then(() => {
				setSuccess(true);
				router.push("/login");
			})
			.catch((err) => {
				console.log(err.message);
				setError(err.message);
			});
	};
	return { success, error, passwordReset };
};
