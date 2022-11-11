import { Timestamp } from "firebase/firestore";

export type loginUser = {
	name: string;
	email: string;
	userImg: string;
	uid: string;
	text: string;
	createTime: Timestamp;
	updateTime: Timestamp;
	username: string;
	[prop: string]: any;
};
