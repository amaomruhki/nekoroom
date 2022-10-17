import React, { useRef, useState } from "react";
import Footer from "../components/layouts/Footer/Footer";
import Header from "../components/layouts/Header/Header";
import {
	Box,
	Container,
	Heading,
	VStack,
	Text,
	Textarea,
	Select,
	Stack,
	Spacer,
	Center,
	Image,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	Input,
	InputGroup,
	InputLeftElement,
	Button,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import PrimaryButton from "../components/elements/Button/PrimaryButton";
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { db, storage } from "../lib/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const PhotoUpload = () => {
	const filePickerRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [inputCaption, setInputCaption] = useState("");
	const [loading, setLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [search, setSearch] = useState("");

	const updateSearch = (event) => {
		setSearch(event.target.value);
	};

	const uploadPost = async () => {
		if (loading) return;
		setLoading(true);
		const docRef = await addDoc(collection(db, "posts"), {
			caption: inputCaption,
			userImg: "../../public/dummyuser.jp",
			username: "dummy",
			timestamp: serverTimestamp(),
		});
		setInputCaption("");
		const imageRef = ref(storage, `posts/${docRef.id}/image`);
		await uploadString(imageRef, selectedFile, "data_url").then(
			async (snapshot) => {
				const downloadURL = await getDownloadURL(imageRef);
				await updateDoc(doc(db, "posts", docRef.id), {
					image: downloadURL,
				});
			}
		);
		setLoading(false);
		setSelectedFile(null);
		// ここに投稿詳細ページに遷移する処理を追加する
	};

	const addImageToPost = (event) => {
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

	const category = [
		{ text: "部屋全体", value: "1" },
		{ text: "猫専用スペース", value: "2" },
		{ text: "キャットタワー", value: "3" },
		{ text: "猫トイレ", value: "4" },
		{ text: "猫食器", value: "5" },
		{ text: "つめとぎ", value: "6" },
		{ text: "猫ベッド", value: "7" },
		{ text: "猫おもちゃ", value: "8" },
		{ text: "ごはん台", value: "9" },
		{ text: "猫グッズ収納", value: "10" },
		{ text: "ネコ飼いライフハック", value: "11" },
		{ text: "お掃除グッズ", value: "12" },
	];

	return (
		<>
			<Header />
			<Container maxW="800px" pt={8} pb={8} mt={20} mb={20}>
				<VStack align="left" spacing={4}>
					<Heading as="h2">ネコルームを投稿する</Heading>
					<Spacer />
					<HStack>
						<Heading as="h3" size="md">
							写真を追加する
						</Heading>
						<Text color="#E4626E" as="b">
							※必須
						</Text>
					</HStack>
					<Text>
						画像形式:JPEG/PNG
						<br />
						容量:10MB以内
						<br />
						推奨サイズ:1536ピクセル×1536ピクセル
					</Text>
					<Box>
						{selectedFile ? (
							<Stack>
								<Image
									src={selectedFile}
									alt=""
									boxSize="250px"
									objectFit="cover"
								/>
								<PrimaryButton
									borderColor="gray.300"
									border="1px"
									bg="#ffffff"
									color="gray.900"
									onClick={() => setSelectedFile(null)}
								>
									写真を変更
								</PrimaryButton>
							</Stack>
						) : (
							<PrimaryButton
								borderColor="gray.300"
								border="1px"
								bg="#ffffff"
								color="gray.900"
								onClick={() => filePickerRef.current.click()}
							>
								写真を選択
							</PrimaryButton>
						)}

						<input
							type="file"
							hidden
							ref={filePickerRef}
							onChange={addImageToPost}
						/>
					</Box>
					<Heading as="h3" size="md">
						テキストを追加する
					</Heading>
					<Textarea
						bg="white"
						placeholder="テキストを入力してください"
						value={inputCaption}
						onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
							setInputCaption(event.target.value);
							console.log(inputCaption);
						}}
					></Textarea>
					<HStack>
						<Heading as="h3" size="md">
							カテゴリを追加する
						</Heading>
						<Text color="#E4626E" as="b">
							※必須
						</Text>
					</HStack>
					<Select bg="white" placeholder="カテゴリを選択してください">
						{category.map(({ text, value }) => (
							<option key={value} value={value}>
								{text}
							</option>
						))}
					</Select>
					<Heading as="h3" size="md">
						アイテムを追加する
					</Heading>
					<PrimaryButton
						bg="#ffffff"
						color="gray.900"
						borderColor="gray.300"
						border="1px"
						onClick={onOpen}
					>
						アイテムを選択
					</PrimaryButton>
					<Modal isOpen={isOpen} onClose={onClose}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>
								<HStack px={10}>
									<InputGroup>
										<InputLeftElement
											pointerEvents="none"
											// eslint-disable-next-line react/no-children-prop
											children={<Search2Icon color="gray.300" />}
										/>
										<Input
											variant="outline"
											placeholder="アイテム名を入力"
											value={search}
											onChange={updateSearch}
										/>
									</InputGroup>
									<Button
										borderColor="gray.300"
										border="1px"
										bg="#ffffff"
										color="gray.900"
										size="md"
										onClick={() => setSelectedFile(null)}
										disabled={!search}
									>
										検索
									</Button>
								</HStack>
							</ModalHeader>
							<ModalCloseButton />
							<ModalBody></ModalBody>

							<ModalFooter></ModalFooter>
						</ModalContent>
					</Modal>
					{/* <Box
						bg="white"
						boxShadow="sm"
						width="120px"
						minW="120px"
						rounded="md"
						p="8px"
						m="8px"
					>
						<Stack align="center">
							<Image
								alt="testphoto"
								src="/testphoto.jpg"
								width="100px"
								height="100px"
							/>
						</Stack>
						<Text fontWeight="bold" fontSize="xs">
							アイテム情報がここに入りますアイテム情報がここに入りますアイテム情報がここに入ります
						</Text>
					</Box> */}
					<Spacer />
					<Center>
						<PrimaryButton
							bg="#E4626E"
							color="#ffffff"
							onClick={uploadPost}
							disabled={!selectedFile || loading}
						>
							ネコルームを投稿する
						</PrimaryButton>
					</Center>
				</VStack>
			</Container>
			<Footer />
		</>
	);
};

export default PhotoUpload;
