import { useState } from "react";
import NextLink from "next/link";
import {
	Input,
	Heading,
	VStack,
	Text,
	Button,
	Spacer,
	Link,
} from "@chakra-ui/react";
import PrimaryButton from "../../components/elements/Button/PrimaryButton";
import { FcGoogle } from "react-icons/fc";
import { Loading } from "../../components/elements/Loading/Loading";
import { useAuth } from "../../Hooks/useAuth";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { emailLogin, googleLogin, guestLogin, isLoading } = useAuth();

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
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
					<NextLink href="/auth/passwordReset" passHref>
						<Link>
							<Text as="u" cursor="pointer" _hover={{ opacity: 0.8 }}>
								パスワードをお忘れですか？
							</Text>
						</Link>
					</NextLink>
					<Spacer />
					<VStack>
						<PrimaryButton
							bg="#E4626E"
							color="#ffffff"
							onClick={() => emailLogin(email, password)}
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
							_hover={{ backgroundColor: "#4285f4", color: "#ffffff" }}
							onClick={googleLogin}
						>
							Googleログイン
						</Button>
					</VStack>
					<Spacer />
					<NextLink href="/auth/register" passHref>
						<Link>
							<Text
								as="u"
								cursor="pointer"
								color="#E4626E"
								_hover={{ opacity: 0.8 }}
							>
								新規登録
							</Text>
						</Link>
					</NextLink>
				</VStack>
			)}
		</>
	);
};

export default Login;
