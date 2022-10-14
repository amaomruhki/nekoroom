import { VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Footer from "../components/layouts/Footer/Footer";
import Header from "../components/layouts/Header/Header";
import Posts from "../components/elements/Posts";

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
			<Header />
			<VStack minH="100vh" pt={8} pb={8} mt="50px">
				<VStack
					w="100%"
					maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "30vw" }}
					pb={100}
				>
					<Posts />
				</VStack>
			</VStack>
			<Footer />
		</>
	);
};

export default Home;
