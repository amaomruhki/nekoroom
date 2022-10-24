import React, { useRef, useState } from "react";
import NextLink from "next/link";
import {
	Box,
	Link,
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
} from "@chakra-ui/react";
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import PrimaryButton from "../components/elements/Button/PrimaryButton";
import Footer from "../components/layouts/Footer/Footer";
import ItemSearch from "../components/elements/Search/ItemSearch";
import Result from "../components/elements/Search/Result";
import Header from "../components/layouts/Header/Header";
import useFetchData from "../Hooks/useFetchData";
import Loading from "../components/elements/Loading/Loading";

const PhotoUpload = () => {
	const filePickerRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [inputCaption, setInputCaption] = useState("");
	const [loading, setLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [itemResult, setItemResult] = useState({});

	//useFetchDataでreturnされたobjectのvalue
	const { fetching, result, handleSubmit } = useFetchData();
	//useFetchDataに渡すstate
	const [value, setValue] = useState({ freeWord: "" });

	//検索フィールド監視
	const handleFreeWord = (event) => {
		setValue({ freeWord: event.target.value });
	};

	//投稿内容をアップロード
	const uploadPost = async () => {
		if (loading) return;
		setLoading(true);
		const docRef = await addDoc(collection(db, "posts"), {
			caption: inputCaption,
			userImg: "../../public/dummyuser.jp",
			username: "dummy",
			timestamp: serverTimestamp(),
			...itemResult,
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
					{Object.keys(itemResult).length ? (
						<HStack
							bg="white"
							boxShadow="md"
							rounded="md"
							w="140px"
							h="140px"
							justify="center"
						>
							<Image
								alt={itemResult.itemName}
								src={itemResult.imageUrl}
								boxSize="100px"
								objectFit="cover"
							/>
						</HStack>
					) : null}
					{!Object.keys(itemResult).length ? (
						<PrimaryButton
							bg="#ffffff"
							color="gray.900"
							borderColor="gray.300"
							border="1px"
							onClick={onOpen}
						>
							アイテムを選択
						</PrimaryButton>
					) : (
						<PrimaryButton
							bg="#ffffff"
							color="gray.900"
							borderColor="gray.300"
							border="1px"
							onClick={onOpen}
						>
							アイテムを変更
						</PrimaryButton>
					)}
					<Modal isOpen={isOpen} onClose={onClose}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader mt={6}>
								<ItemSearch
									value={value}
									handleFreeWord={handleFreeWord}
									handleSubmit={handleSubmit}
									placeholder="アイテム名を入力"
								/>
							</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								{fetching ? (
									<Loading />
								) : (
									//fetch完了したらレスポンスデータを表示
									<Result
										result={result}
										setItemResult={setItemResult}
										onClose={onClose}
										setValue={setValue}
									/>
								)}
							</ModalBody>
							<ModalFooter>
								<NextLink href="https://developers.rakuten.com/" passHref>
									<Link>Supported by Rakuten Developers</Link>
								</NextLink>
							</ModalFooter>
						</ModalContent>
					</Modal>
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
