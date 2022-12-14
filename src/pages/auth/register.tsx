import React, { useRef, useState } from "react";
import Link from "next/link";
import {
	Input,
	Heading,
	VStack,
	Text,
	Spacer,
	Avatar,
	Stack,
	HStack,
	Button,
} from "@chakra-ui/react";
import PrimaryButton from "../../components/elements/Button/PrimaryButton";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import {
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../lib/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { Loading } from "../../components/elements/Loading/Loading";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../Hooks/useAuth";

const Register = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const filePickerRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	const { googleLogin } = useAuth();

	const onSignIn = async () => {
		try {
			setIsLoading(true);
			const auth = getAuth();
			await createUserWithEmailAndPassword(auth, email, password);
			const user = auth.currentUser;
			const docRef = doc(db, "users", user!.uid);
			const docSnap = await getDoc(docRef);
			if (!docSnap.exists()) {
				await setDoc(docRef, {
					name: username,
					email: email,
					uid: user!.uid,
					createTime: serverTimestamp(),
					updateTime: serverTimestamp(),
					username: username,
					userImg: "",
					text: "",
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
				);
			}
			setIsLoading(false);
			router.push("/");
		} catch (error) {
			alert(error);
			setIsLoading(false);
		}
	};

	const addImageToProfile = (event: any) => {
		const reader = new FileReader();
		if (event.target.files[0]) {
			reader.readAsDataURL(event.target.files[0]);
		}

		reader.onload = (readerEvent: any) => {
			setSelectedFile(readerEvent.target.result);
		};
		//state??????????????????????????????onChange??????????????????????????????????????????????????????????????????????????????
		event.target.value = "";
	};

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<VStack align="center" spacing={4}>
					<Heading as="h2" size="lg">
						????????????
					</Heading>
					<Spacer />
					<Stack width="320px">
						<VStack>
							{selectedFile ? (
								<HStack>
									<Avatar size="md" name={username} src={selectedFile} />
									<PrimaryButton
										borderColor="gray.300"
										border="1px"
										bg="#ffffff"
										color="gray.900"
										onClick={() => setSelectedFile(null)}
									>
										???????????????????????????
									</PrimaryButton>
								</HStack>
							) : (
								<HStack>
									<Avatar size="md" name={username} />
									<PrimaryButton
										borderColor="gray.300"
										border="1px"
										bg="#ffffff"
										color="gray.900"
										onClick={() => filePickerRef.current?.click()}
									>
										???????????????????????????
									</PrimaryButton>
								</HStack>
							)}
							<Text fontSize="xs">
								???????????????????????????????????????????????????????????????????????????????????????????????????
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
						placeholder="??????????????????"
						type="text"
						value={username}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setUsername(e.target.value);
						}}
					/>

					<Input
						width="320px"
						bg="white"
						placeholder="?????????????????????"
						type="email"
						value={email}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setEmail(event.target.value);
						}}
					/>
					<Input
						width="320px"
						bg="white"
						placeholder="???????????????"
						type="password"
						value={password}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setPassword(e.target.value);
						}}
					/>
					<Spacer />
					<PrimaryButton
						bg="#E4626E"
						color="#ffffff"
						onClick={onSignIn}
						disabled={!username || !email || !password}
					>
						????????????
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
						Google???????????????
					</Button>
					<Link href="/auth/login">
						<Text
							as="u"
							cursor="pointer"
							color="#E4626E"
							_hover={{ opacity: 0.8 }}
						>
							????????????
						</Text>
					</Link>
				</VStack>
			)}
		</>
	);
};

export default Register;
