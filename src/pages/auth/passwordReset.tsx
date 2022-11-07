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
	Box,
	FormControl,
} from "@chakra-ui/react";
import PrimaryButton from "../../components/elements/Button/PrimaryButton";
import { FcGoogle } from "react-icons/Fc";
import { useGoogleLogin } from "../../Hooks/useGoogleLogin";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Loading from "../../components/elements/Loading/Loading";
import { usePasswordReset } from "../../components/elements/Auth/auth";

const PasswordReset = (): JSX.Element => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { success, error, passwordReset } = usePasswordReset();
	const router = useRouter();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		passwordReset(email);
	};

	return (
		<>
			<Header />
			{isLoading ? (
				<Loading />
			) : (
				<Container maxW="800px" pt={8} pb={8} mt={20} mb={40}>
					<VStack align="center" spacing={4}>
						<Heading as="h2" size="lg">
							パスワード再設定
						</Heading>
						<Text>
							登録しているメールアドレスをご入力ください。入力したアドレス宛にメールを送信します。
						</Text>
						<Spacer />
						<FormControl onSubmit={handleSubmit}>
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
						</FormControl>
						<VStack>
							<PrimaryButton
								bg="#E4626E"
								color="#ffffff"
								type="submit"
								disabled={!email}
							>
								送信
							</PrimaryButton>
						</VStack>

						<Spacer />
						<Link href="/auth/login">
							<Text
								as="u"
								cursor="pointer"
								color="#E4626E"
								_hover={{ opacity: 0.8 }}
							>
								ログインに戻る
							</Text>
						</Link>
					</VStack>
				</Container>
			)}

			<Footer />
		</>
	);
};

export default PasswordReset;
