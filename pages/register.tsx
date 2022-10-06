import React from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Footer from "../components/layouts/Footer/Footer";
import Header from "../components/layouts/Header/Header";
import {
	Input,
	Box,
	Container,
	Heading,
	HStack,
	VStack,
	Text,
	Textarea,
	Select,
	Button,
	Stack,
	Spacer,
} from "@chakra-ui/react";
import PrimaryButton from "../components/elements/Button/PrimaryButton";

const Register = () => {
	return (
		<>
			<Header />
			<Container maxW="800px" pt={8} pb={8} mt={20}>
				<VStack align="center" spacing={4}>
					<Heading as="h2" size="lg">
						新規登録
					</Heading>
					<Spacer />
					<Input width="400px" bg="white" placeholder="ニックネーム" />
					<Input width="400px" bg="white" placeholder="メールアドレス" />
					<Input width="400px" bg="white" placeholder="パスワード" />
					<Spacer />
					<PrimaryButton variant="solid" bg="#E4626E" color="#ffffff">
						新規登録
					</PrimaryButton>
					<Link href="/">
						<Text as="u">ログイン</Text>
					</Link>
				</VStack>
			</Container>
			<Footer />
		</>
	);
};

export default Register;
