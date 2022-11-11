import { useState } from "react";
import axios from "axios";

// Rakuten APIで用意されているエンドポイント
const BASE_URL =
	"https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?format=json";

const useFetchData = () => {
	//ローディング用
	const [fetching, setFetching] = useState(false);
	//レスポンス格納用
	const [result, setResult] = useState({});

	const handleSubmit = (value: any) => {
		const params = value.freeWord;

		if (params) {
			setFetching(true);

			const encodedParams = encodeFreeWord(params);

			axios
				.get(
					`${BASE_URL}&keyword=${encodedParams}&page=1&applicationId=${process.env.NEXT_PUBLIC_RAKUTEN_APP_ID}`
				)
				.then((response) => {
					setResult(response.data);
					setFetching(false);
				})
				.catch((error) => {
					console.log(error);
					setFetching(false);
				});
		} else {
			//null時はエラー
			console.log(`検索条件を入力してください`);
			setFetching(false);
		}
	};

	//日本語入力をエンコード
	const encodeFreeWord = (params: string) => {
		let urlEncode = require("urlencode");
		return urlEncode(params);
	};

	return { fetching, result, handleSubmit };
};

export default useFetchData;
