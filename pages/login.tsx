import React from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
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
	Image,
} from "@chakra-ui/react";
import PrimaryButton from "../components/elements/Button/PrimaryButton";
import { useUser, googleLogin, googleLogout } from "../lib/auth";
import { FcGoogle } from "react-icons/Fc";

const Login = (): JSX.Element => {
	const router = useRouter();
	const user = useUser();
	const handleLogin = (): void => {
		googleLogin().catch((error) => console.error(error));
		user !== null ? router.push("/") : router.push("/login");
	};
	// const handleLogout = (): void => {
	// 	googleLogout().catch((error) => console.error(error));
	// 	user !== null ? router.push("/") : router.push("/login");
	// };

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
						<PrimaryButton
							variant="solid"
							bg="#D6D6D6"
							color="#ffffff"
							onClick={handleLogin}
						>
							ゲストログイン
						</PrimaryButton>
						<PrimaryButton
							variant="solid"
							bg="#E4626E"
							color="#ffffff"
							onClick={handleLogin}
						>
							ログイン
						</PrimaryButton>
						<Button
							onClick={handleLogin}
							width="200px"
							height="45px"
							bg="#ffffff"
							variant="outline"
							leftIcon={<FcGoogle />}
							border="2px"
							borderColor="#4285f4"
							color="#4285f4"
							_hover={{ opacity: 1.2 }}
						>
							Googleログイン
						</Button>
						<PrimaryButton
							variant="outline"
							bg="#ffffff"
							color="gray.900"
							onClick={handleLogin}
						>
							新規登録
						</PrimaryButton>
					</VStack>
				</VStack>
			</Container>
			<Footer />
		</>
	);
};

export default Login;
