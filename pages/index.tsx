import { Box, Container, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import SampleText from "../components/elements/SampleText";
import Footer from "../components/layouts/Header/Footer";
import Header from "../components/layouts/Header/Header";

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
			<Container maxW="800px" padding={{ base: 3, md: 5 }}>
				<Box>
					<SampleText />
				</Box>
			</Container>
			<Footer />
		</>
	);
};

export default Home;
