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
	FormErrorMessage,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from "@chakra-ui/react";
import PrimaryButton from "../../components/elements/Button/PrimaryButton";
import Loading from "../../components/elements/Loading/Loading";
import { usePasswordReset } from "../../components/elements/Auth/auth";
// import { useForm } from "react-hook-form";

const PasswordReset = (): JSX.Element => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { success, error, passwordReset } = usePasswordReset();
	const router = useRouter();

	// const partnerInput = () => {
	// 	const {
	// 		handleSubmit,
	// 		register,
	// 		formState: { errors, isSubmitting },
	// 	} = useForm();
	// };

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
						<form onSubmit={onSubmit} align="center">
							<FormControl>
								<Input
									id="email"
									width="320px"
									bg="white"
									placeholder="メールアドレス"
									type="email"
									value={email}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										setEmail(event.target.value);
									}}
								/>
								{error && (
									<Alert
										status="error"
										mt={2}
										flexDirection="column"
										alignItems="center"
										justifyContent="center"
										textAlign="center"
									>
										<AlertIcon />
										<AlertTitle mt={4} mb={1} fontSize="md">
											メールが送信できませんでした
										</AlertTitle>
										<AlertDescription maxWidth="sm">
											メールアドレスが間違っているか、アカウントの登録がない可能性があります
										</AlertDescription>
									</Alert>
								)}
								{success && (
									<Alert
										status="success"
										mt={2}
										flexDirection="column"
										alignItems="center"
										justifyContent="center"
										textAlign="center"
									>
										<AlertIcon />
										<AlertTitle mt={4} mb={1} fontSize="md">
											メールが送信されました
										</AlertTitle>
										<AlertDescription maxWidth="sm">
											メールが見つからない場合は、迷惑メールフォルダに振り分けられている可能性があります
										</AlertDescription>
									</Alert>
								)}
							</FormControl>
							<VStack mt={4}>
								<PrimaryButton
									bg="#E4626E"
									color="#ffffff"
									type="submit"
									disabled={!email}
								>
									送信
								</PrimaryButton>
							</VStack>
						</form>
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
