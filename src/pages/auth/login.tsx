import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Footer from "../../components/layouts/Footer/Footer";
import Header from "../../components/layouts/Header/Header";
import {
	Input,
	Container,
	Heading,
	VStack,
	Text,
	Button,
	Spacer,
} from "@chakra-ui/react";
import PrimaryButton from "../../components/elements/Button/PrimaryButton";
import { FcGoogle } from "react-icons/Fc";
import { useGoogleLogin } from "../../Hooks/useGoogleLogin";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Loading from "../../components/elements/Loading/Loading";

const Login = (): JSX.Element => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const guestEmail = "guest@dummy.com";
	const guestPassword = "guestDummy";
	const router = useRouter();

	const emailLogin = async () => {
		try {
			setIsLoading(true);
			const auth = getAuth();
			await signInWithEmailAndPassword(auth, email, password);
			router.push("/");
		} catch (error) {
			alert("エラーが発生しました");
		}
	};

	const guestLogin = async () => {
		try {
			const auth = getAuth();
			await signInWithEmailAndPassword(auth, guestEmail, guestPassword);
			router.push("/");
		} catch (error) {
			alert("エラーが発生しました");
		}
	};

	return (
		<>
			<Header />
			{isLoading ? (
				<Loading />
			) : (
				<Container maxW="800px" pt={8} pb={8} mt={20}>
					<VStack align="center" spacing={4}>
						<Heading as="h2" size="lg">
							ログイン
						</Heading>
						<Spacer />
						<Input
							width="320px"
							bg="white"
							placeholder="メールアドレス"
							type="email"
							value={email}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								setEmail(event.target.value);
							}}
						/>
						<Input
							width="320px"
							bg="white"
							placeholder="パスワード"
							type="password"
							value={password}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setPassword(e.target.value);
							}}
						/>
						<Link href="/auth/resetPassword">
							<Text as="u" cursor="pointer" _hover={{ opacity: 0.8 }}>
								パスワードをお忘れですか？
							</Text>
						</Link>
						<Spacer />
						<VStack>
							<PrimaryButton
								bg="#E4626E"
								color="#ffffff"
								onClick={emailLogin}
								disabled={!password || !email}
							>
								ログイン
							</PrimaryButton>
							<PrimaryButton
								border="1px"
								borderColor="#E4626E"
								bg="#ffffff"
								color="#E4626E"
								onClick={guestLogin}
							>
								ゲストログイン
							</PrimaryButton>
							<Button
								width="200px"
								height="45px"
								bg="#ffffff"
								variant="outline"
								leftIcon={<FcGoogle />}
								border="2px"
								borderColor="#4285f4"
								color="#4285f4"
								_hover={{ opacity: 1.2 }}
								onClick={useGoogleLogin}
							>
								Googleログイン
							</Button>
						</VStack>
						<Spacer />
						<Link href="/auth/register">
							<Text
								as="u"
								cursor="pointer"
								color="#E4626E"
								_hover={{ opacity: 0.8 }}
							>
								新規登録
							</Text>
						</Link>
					</VStack>
				</Container>
			)}

			<Footer />
		</>
	);
};

export default Login;