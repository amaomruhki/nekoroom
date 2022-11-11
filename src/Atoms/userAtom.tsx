import { User } from "firebase/auth";
import { atom } from "recoil";

export type UserState = User | null;

//ユーザー情報を保持
export const userState = atom<UserState>({
	key: "userState",
	default: null,
	dangerouslyAllowMutability: true,
});
