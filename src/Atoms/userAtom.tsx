import { atom } from "recoil";
import { User } from "firebase/auth";

export type UserState = User | null;

export const userState = atom<UserState>({
	key: "userState",
	default: null,
	dangerouslyAllowMutability: true,
});

export const postState = atom({
	key: "postState",
	default: null,
	dangerouslyAllowMutability: true,
});
