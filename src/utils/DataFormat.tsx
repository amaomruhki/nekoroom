import { Timestamp } from "firebase/firestore";

//商品名を45文字目以降「…」にする
export const convertSubstring = (word: string, limit: number): string => {
	const notSplitWord = word;
	if (notSplitWord.length > limit) {
		const splitWord = notSplitWord.substring(0, limit);
		return splitWord + "...";
	} else {
		return notSplitWord;
	}
};

// Timestamp型から文字列への変換
export const parseTimestampToDate = (
	timestamp: Timestamp,
	separator: string
): string => {
	const date = timestamp.toDate();
	const year = date.getFullYear();
	const month = ("00" + (date.getMonth() + 1)).slice(-2);
	const day = ("00" + date.getDate()).slice(-2);
	const hour = ("00" + date.getHours()).slice(-2);
	const minutes = ("00" + date.getMinutes()).slice(-2);

	return `${year}${separator}${month}${separator}${day} ${hour}:${minutes}`;
};
