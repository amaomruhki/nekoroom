import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
	Input,
	Container,
	Heading,
	VStack,
	HStack,
	Text,
	Spacer,
	Avatar,
	Textarea,
	FormLabel,
	FormControl,
} from "@chakra-ui/react";
import PrimaryButton from "../../components/elements/Button/PrimaryButton";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import {
	doc,
	getDoc,
	onSnapshot,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../lib/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Loading from "../../components/elements/Loading/Loading";
import { userState } from "../../Atoms/userAtom";
import { useRecoilState } from "recoil";

const MyProfileEdit = () => {
	const [userItem, setUserItem] = useState([]);
	const filePickerRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	const [currentUser] = useRecoilState(userState);

	//ユーザー情報を取得
	useEffect(() => {
		if (currentUser) {
			setIsLoading(true);
			const loginUserId = currentUser.uid as string;
			const unsubscribe = onSnapshot(
				doc(db, "users", loginUserId),
				(snapshot) => {
					const userData = {
						userId: snapshot.data()?.uid,
						username: snapshot.data()?.username,
						userImg: snapshot.data()?.userImg,
						text: snapshot.data()?.text,
					};
					setUserItem(userData);
				}
			);
			setIsLoading(false);
			return () => unsubscribe();
		}
	}, []);

	// プロフィールの更新
	const editProfile = async () => {
		try {
			if (currentUser) {
				setIsLoading(true);
				const userId = currentUser.uid;
				const docRef = doc(db, "users", userId);
				await updateDoc(docRef, {
					updateTime: serverTimestamp(),
					username: userItem.username,
					text: userItem.text,
				});

				const imageRef = ref(storage, `users/${docRef.id}/image`);
				if (selectedFile) {
					await uploadString(imageRef, selectedFile, "data_url").then(
						async (snapshot) => {
							const downloadURL = await getDownloadURL(imageRef);
							await updateDoc(doc(db, "users", docRef.id), {
								userImg: downloadURL,
							});
						}
					);
				}
				router.push("/");
			}
		} catch (error) {
			alert(error);
			setIsLoading(false);
		}
	};

	// アイコン画像の追加
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
			{currentUser && !isLoading ? (
				<Container maxW="800px" pt={8} pb={8} mt={20}>
					<VStack align="center" spacing={4}>
						<Heading as="h2" size="lg">
							プロフィール編集
						</Heading>
						<Spacer />
						<VStack>
							{selectedFile ? (
								<>
									<Avatar
										size="md"
										name={userItem.username}
										src={selectedFile}
									/>
									<PrimaryButton
										borderColor="gray.300"
										border="1px"
										bg="#ffffff"
										color="gray.900"
										onClick={() => setSelectedFile(null)}
									>
										アイコン画像を変更
									</PrimaryButton>
								</>
							) : (
								<>
									<Avatar
										size="md"
										name={userItem.username}
										src={userItem.userImg}
									/>
									{/* <Avatar size="md" name={username} /> */}
									<PrimaryButton
										borderColor="gray.300"
										border="1px"
										bg="#ffffff"
										color="gray.900"
										onClick={() => filePickerRef.current.click()}
									>
										アイコン画像を選択
									</PrimaryButton>
								</>
							)}
							<PrimaryButton
								bg="#ffffff"
								color="gray.900"
								borderColor="gray.300"
								border="1px"
								onClick={() => {
									setUserItem({ ...userItem, userImg: "" });
									setSelectedFile(null);
								}}
							>
								アイコン画像をリセット
							</PrimaryButton>
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
						<Spacer />

						<VStack
							w={{
								base: "320px",
								md: "500px",
								lg: "700px",
							}}
							spacing={2}
						>
							<FormControl>
								<FormLabel fontSize="sm">ニックネーム</FormLabel>
								<Input
									bg="white"
									placeholder="ニックネーム"
									type="text"
									value={userItem.username}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										setUserItem({ ...userItem, username: event.target.value });
									}}
								/>
								<FormLabel fontSize="sm" mt={2}>
									自己紹介
								</FormLabel>
								<Textarea
									bg="white"
									placeholder="自己紹介"
									value={userItem.text}
									onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
										setUserItem({ ...userItem, text: event.target.value });
									}}
								></Textarea>
							</FormControl>
						</VStack>

						<Spacer />
						<PrimaryButton
							bg="#E4626E"
							color="#ffffff"
							onClick={editProfile}
							disabled={!userItem.username}
						>
							保存
						</PrimaryButton>
					</VStack>
				</Container>
			) : (
				<Loading />
			)}
		</>
	);
};

export default MyProfileEdit;
