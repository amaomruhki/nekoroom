import React, { useRef, useState } from "react";
import Link from "next/link";
import Footer from "../../components/layouts/Footer/Footer";
import Header from "../../components/layouts/Header/Header";
import {
	Input,
	Container,
	Heading,
	VStack,
	Text,
	Spacer,
	Avatar,
	Stack,
	HStack,
} from "@chakra-ui/react";
import PrimaryButton from "../../components/elements/Button/PrimaryButton";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../lib/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const Register = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [userName, setUserName] = useState("");
	const filePickerRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const router = useRouter();

	const onSignIn = async () => {
		try {
			const auth = getAuth();
			await createUserWithEmailAndPassword(auth, email, password);
			const user = auth.currentUser;
			const docRef = doc(db, "users", user.uid);
			const docSnap = await getDoc(docRef);
			if (!docSnap.exists()) {
				await setDoc(docRef, {
					name: userName,
					email: email,
					uid: user.uid,
					timestamp: serverTimestamp(),
					username: userName,
				});
			}
			const imageRef = ref(storage, `users/${docRef.id}/image`);
			if (selectedFile) {
				await uploadString(imageRef, selectedFile, "data_url").then(
					async (snapshot) => {
						const downloadURL = await getDownloadURL(imageRef);
						await updateDoc(doc(db, "users", docRef.id), {
							userImg: downloadURL,
						});
					}
				}
			router.push("/");
		} catch (error) {
			alert("エラーが発生しました");
		}

	};

	const addImageToProfile = (event) => {
		const reader = new FileReader();
		if (event.target.files[0]) {
			reader.readAsDataURL(event.target.files[0]);
		}

		reader.onload = (readerEvent) => {
			setSelectedFile(readerEvent.target.result);
		};
		//stateで管理している場合、onChangeは同じファイルを選択すると発火しないのでここで初期化
		event.target.value = "";
	};

	return (
		<>
			<Header />
			<Container maxW="800px" pt={8} pb={8} mt={20}>
				<VStack align="center" spacing={4}>
					<Heading as="h2" size="lg">
						新規登録
					</Heading>
					<Spacer />
					<Stack width="320px">
						<VStack>
							{selectedFile ? (
								<HStack>
									<Avatar size="md" name={userName} src={selectedFile} />
									<PrimaryButton
										borderColor="gray.300"
										border="1px"
										bg="#ffffff"
										color="gray.900"
										onClick={() => setSelectedFile(null)}
									>
										アイコン画像を変更
									</PrimaryButton>
								</HStack>
							) : (
								<HStack>
									<Avatar
										size="md"
										name={userName}
										src="https://bit.ly/broken-link"
									/>
									<PrimaryButton
										borderColor="gray.300"
										border="1px"
										bg="#ffffff"
										color="gray.900"
										onClick={() => filePickerRef.current.click()}
									>
										アイコン画像を選択
									</PrimaryButton>
								</HStack>
							)}
							<Text fontSize="xs">
								画像を設定しない場合は、ニックネームの頭文字がアイコンになります。
							</Text>
							<input
								type="file"
								hidden
								ref={filePickerRef}
								onChange={addImageToProfile}
							/>
						</VStack>
					</Stack>
					<Input
						width="320px"
						bg="white"
						placeholder="ニックネーム"
						type="text"
						value={userName}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setUserName(e.target.value);
						}}
					/>

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
					<Spacer />
					<PrimaryButton bg="#E4626E" color="#ffffff" onClick={onSignIn}>
						新規登録
					</PrimaryButton>
					<Link href="/auth/login">
						<Text
							as="u"
							cursor="pointer"
							color="#E4626E"
							_hover={{ opacity: 0.8 }}
						>
							ログイン
						</Text>
					</Link>
				</VStack>
			</Container>
			<Footer />
		</>
	);
};

export default Register;
