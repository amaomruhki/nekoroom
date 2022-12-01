import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import {
	Box,
	Link,
	Heading,
	VStack,
	Text,
	Textarea,
	Stack,
	Spacer,
	Center,
	Image,
	HStack,
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
import { useFetchData } from "../Hooks/useFetchData";
import { Loading } from "../components/elements/Loading/Loading";
import { userState } from "../Atoms/userAtom";
import { ItemAddModal } from "../components/elements/ItemAddModal";

const PhotoUpload = () => {
	const filePickerRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const [inputCaption, setInputCaption] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [itemResult, setItemResult] = useState<any>({});
	const [currentUser] = useRecoilState(userState);
	const router = useRouter();

	//useFetchDataでreturnされたobjectのvalue
	const { fetching, result, handleSubmit } = useFetchData();
	//useFetchDataに渡すstate
	const [value, setValue] = useState({ freeWord: "" });

	//検索フィールド監視
	const handleFreeWord = (event: any) => {
		setValue({ freeWord: event.target.value });
	};

	const addImageToPost = (event: any) => {
		const reader = new FileReader();
		if (event.target.files[0]) {
			reader.readAsDataURL(event.target.files[0]);
		}

		reader.onload = (readerEvent: any) => {
			setSelectedFile(readerEvent?.target.result);
		};
		//stateで管理している場合、onChangeは同じファイルを選択すると発火しないのでここで初期化
		event.target.value = "";
	};

	//投稿内容をアップロード
	const uploadPost = async () => {
		setIsLoading(true);
		if (!currentUser) return;
		const postsRef = await addDoc(
			collection(db, "users", currentUser.uid, "posts"),
			{
				userId: currentUser.uid,
				caption: inputCaption,
				createTime: serverTimestamp(),
				updateTime: serverTimestamp(),
				likeCount: 0,
			}
		);
		setInputCaption("");
		const imageRef = ref(storage, `posts/${postsRef.id}/image`);
		if (typeof selectedFile !== "string") return;
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
		// アイテムがセットされていたらアップロード
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
			await updateDoc(doc(db, "users", currentUser.uid, "posts", postsRef.id), {
				itemId: itemsRef.id,
			});
		}
		setSelectedFile(null);
		setIsLoading(false);
		router.push(`${currentUser.uid}/${postsRef.id}/postDetail`);
	};

	return (
		<>
			{currentUser && !isLoading ? (
				<VStack align="left" spacing={4}>
					<Heading as="h2">写真を投稿する</Heading>
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
					<ItemAddModal
						onClose={onClose}
						isOpen={isOpen}
						result={result}
						fetching={fetching}
						handleSubmit={handleSubmit}
						setItemResult={setItemResult}
						value={value}
						setValue={setValue}
						handleFreeWord={handleFreeWord}
					/>
					<Spacer />
					<Center>
						<PrimaryButton
							bg="#E4626E"
							color="#ffffff"
							onClick={uploadPost}
							disabled={!selectedFile || isLoading}
						>
							写真を投稿する
						</PrimaryButton>
					</Center>
				</VStack>
			) : (
				<Loading />
			)}
		</>
	);
};

export default PhotoUpload;
