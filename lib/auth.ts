import {
	getAuth,
	signInWithRedirect,
	signOut,
	GoogleAuthProvider,
	onAuthStateChanged,
} from "firebase/auth";
import { app } from "./firebase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { UserState, userState } from "../Atoms/userAtom";
import { useEffect, useState } from "react";

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
