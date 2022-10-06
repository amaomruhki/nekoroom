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

const login = () => {
	return (
		<>
			<Header />
			<Container maxW="800px" pt={8} pb={8} mt={20}>
				<VStack align="center" spacing={4}>
					<Heading as="h2" size="lg">
						ログイン
					</Heading>
					<Spacer />
					<Input width="400px" bg="white" placeholder="メールアドレス" />
					<Input width="400px" bg="white" placeholder="パスワード" />
					<Link href="/">
						<Text as="u" cursor="pointer" _hover={{ opacity: 0.8 }}>
							パスワードをお忘れですか？
						</Text>
					</Link>
					<Spacer />
					<VStack>
						<PrimaryButton variant="solid" bg="#D6D6D6" color="#ffffff">
							ゲストログイン
						</PrimaryButton>
						<PrimaryButton variant="solid" bg="#E4626E" color="#ffffff">
							ログイン
						</PrimaryButton>
						<PrimaryButton variant="outline" bg="#ffffff" color="gray.900">
							新規登録
						</PrimaryButton>
					</VStack>
				</VStack>
			</Container>
			<Footer />
		</>
	);
};

export default login;
