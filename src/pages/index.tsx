import { VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Posts from "../components/layouts/Posts/Posts";

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>NekoRoom</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta
					property="description"
					content="NekoRoomはネコを飼っている方のお部屋やネコちゃん用アイテムの写真を共有するサイトです。"
				/>
			</Head>
			<VStack minH="100vh">
				<Posts />
			</VStack>
		</>
	);
};

export default Home;
