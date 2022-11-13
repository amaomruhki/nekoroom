import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

type User = {
	name: string;
	email: string;
	uid: string;
	createTime: Timestamp;
	updateTime: Timestamp;
	username: string;
	userImg: string;
	text: string;
};

export type UserState = User | null;

//ユーザー情報を保持
export const userState = atom<UserState>({
	key: "userState",
	default: null,
	dangerouslyAllowMutability: true,
});
