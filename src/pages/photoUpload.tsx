import { useRef, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import {
	Box,
	Link,
	Container,
	Heading,
	VStack,
	Text,
	Textarea,
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
import { db, storage } from "../../lib/firebase";
import PrimaryButton from "../components/elements/Button/PrimaryButton";
import Footer from "../components/layouts/Footer/Footer";
import ItemSearch from "../components/elements/Search/ItemSearch";
import Result from "../components/elements/Search/Result";
import Header from "../components/layouts/Header/Header";
import useFetchData from "../Hooks/useFetchData";
import Loading from "../components/elements/Loading/Loading";
import { userState } from "../Atoms/userAtom";

const PhotoUpload = () => {
	const filePickerRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [inputCaption, setInputCaption] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [itemResult, setItemResult] = useState({});
	const [currentUser] = useRecoilState(userState);
	const router = useRouter();

	//useFetchDataでreturnされたobjectのvalue
	const { fetching, result, handleSubmit } = useFetchData();
	//useFetchDataに渡すstate
	const [value, setValue] = useState({ freeWord: "" });

	//検索フィールド監視
	const handleFreeWord = (event) => {
		setValue({ freeWord: event.target.value });
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

	//投稿内容をアップロード
	const uploadPost = async () => {
		if (isLoading) return;
		setIsLoading(true);
		const postsRef = await addDoc(
			collection(db, "users", currentUser!.uid, "posts"),
			{
				userId: currentUser!.uid,
				caption: inputCaption,
				createTime: serverTimestamp(),
				updateTime: serverTimestamp(),
				likeCount: 0,
			}
		);
		setInputCaption("");
		const imageRef = ref(storage, `posts/${postsRef.id}/image`);
		await uploadString(imageRef, selectedFile, "data_url").then(
			async (snapshot) => {
				const downloadURL = await getDownloadURL(imageRef);
				await updateDoc(
					doc(db, "users", currentUser!.uid, "posts", postsRef.id),
					{
						image: downloadURL,
						postId: postsRef.id,
					}
				);
			}
		);

		if (Object.keys(itemResult).length != 0) {
			const itemsRef = await addDoc(
				collection(
					db,
					"users",
					currentUser!.uid,
					"posts",
					postsRef.id,
					"items"
				),
				{
					...itemResult,
					postId: postsRef.id,
					itemImg: itemResult.imageUrl,
					itemName: itemResult.itemName,
					price: itemResult.price,
					shopName: itemResult.shopName,
					itemUrl: itemResult.itemUrl,
				}
			);
			await updateDoc(
				doc(db, "users", currentUser!.uid, "posts", postsRef.id),
				{
					itemId: itemsRef.id,
				}
			);
			await updateDoc(
				doc(
					db,
					"users",
					currentUser!.uid,
					"posts",
					postsRef.id,
					"items",
					itemsRef.id
				),
				{
					itemId: itemsRef.id,
				}
			);
		}
		setSelectedFile(null);
		setIsLoading(false);
		router.push(`${currentUser!.uid}/${postsRef.id}/postDetail`);
	};

	return (
		<>
			<Header />
			{currentUser && !isLoading ? (
				<Container maxW="800px" pt={8} pb={8} mt={20} mb={20}>
					<VStack align="left" spacing={4}>
						<Heading as="h2">投稿を投稿する</Heading>
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
									onClick={() => filePickerRef.current!.click()}
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
						<HStack>
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
								<>
									<PrimaryButton
										bg="#ffffff"
										color="gray.900"
										borderColor="gray.300"
										border="1px"
										onClick={onOpen}
									>
										アイテムを変更
									</PrimaryButton>
									<PrimaryButton
										bg="#ffffff"
										color="gray.900"
										borderColor="gray.300"
										border="1px"
										onClick={() => {
											setItemResult({});
										}}
									>
										アイテムをリセット
									</PrimaryButton>
								</>
							)}
						</HStack>
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
										<Link target="_blank">Supported by Rakuten Developers</Link>
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
								disabled={!selectedFile || isLoading}
							>
								投稿を投稿する
							</PrimaryButton>
						</Center>
					</VStack>
				</Container>
			) : (
				<Loading />
			)}

			<Footer />
		</>
	);
};

export default PhotoUpload;
