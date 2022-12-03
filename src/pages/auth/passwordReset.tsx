import { useState } from "react";
import NextLink from "next/link";
import {
	Input,
	Heading,
	VStack,
	Text,
	Spacer,
	Link,
	FormControl,
} from "@chakra-ui/react";
import PrimaryButton from "../../components/elements/Button/PrimaryButton";
import { usePasswordReset } from "../../Hooks/useAuth";
import { AlertMessage } from "../../components/elements/AlertMessage";

const PasswordReset = (): JSX.Element => {
	const [email, setEmail] = useState("");
	const { success, error, passwordReset } = usePasswordReset();

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		passwordReset(email);
	};

	return (
		<>
			<VStack align="center" spacing={4}>
				<Heading as="h2" size="lg">
					パスワード再設定
				</Heading>
				<Text>
					登録しているメールアドレスをご入力ください。入力したアドレス宛にメールを送信します。
				</Text>
				<Spacer />
				<form onSubmit={onSubmit}>
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
							<AlertMessage
								title={"メールが送信できませんでした"}
								description={
									" メールアドレスが間違っているか、アカウントの登録がない可能性があります"
								}
								status={"error"}
							/>
						)}
						{success && (
							<AlertMessage
								title={"メールが送信されました"}
								description={
									"メールが見つからない場合は、迷惑メールフォルダに振り分けられている可能性があります"
								}
								status={"success"}
							/>
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
				<NextLink href="/auth/login" passHref>
					<Link>
						<Text
							as="u"
							cursor="pointer"
							color="#E4626E"
							_hover={{ opacity: 0.8 }}
						>
							ログインに戻る
						</Text>
					</Link>
				</NextLink>
			</VStack>
		</>
	);
};

export default PasswordReset;
