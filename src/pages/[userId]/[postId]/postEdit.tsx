import React, { useEffect, useRef, useState } from "react";
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
	Button,
	Divider,
} from "@chakra-ui/react";
import {
	addDoc,
	collection,
	doc,
	onSnapshot,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

import { userState } from "../../../Atoms/userAtom";
import { db, storage } from "../../../../lib/firebase";
import useFetchData from "../../../Hooks/useFetchData";
import Header from "../../../components/layouts/Header/Header";
import PrimaryButton from "../../../components/elements/Button/PrimaryButton";
import ItemSearch from "../../../components/elements/Search/ItemSearch";
import Loading from "../../../components/elements/Loading/Loading";
import Result from "../../../components/elements/Search/Result";
import Footer from "../../../components/layouts/Footer/Footer";

const PostEdit = () => {
	const filePickerRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [inputCaption, setInputCaption] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [itemResult, setItemResult] = useState({});
	const [items, setItems] = useState();
	const [post, setPost] = useState([]);
	const [currentUser] = useRecoilState(userState);
	const router = useRouter();

	//投稿した記事情報を取得
	useEffect(() => {
		setIsLoading(true);
		if (router.isReady) {
			const authorId = router.query.userId as string;
			const postId = router.query.postId as string;
			const unsubscribe = onSnapshot(
				doc(db, "users", authorId, "posts", postId),
				(snapshot) => {
					const postData = {
						postId: snapshot.data()?.id,
						image: snapshot.data()?.image,
						caption: snapshot.data()?.caption,
						likeCount: snapshot.data()?.likeCount,
					};
					setPost(postData);
				}
			);
			console.log(postId);
			console.log(authorId);
			return () => unsubscribe();
		}
	}, [router.isReady, router.query.userId]);

	//アイテム取得
	useEffect(() => {
		setIsLoading(true);
		if (router.isReady) {
			const authorId = router.query.userId as string;
			const postId = router.query.postId as string;
			const itemsRef = query(
				collection(db, "users", authorId, "posts", postId, "items"),
				where("postId", "==", postId)
			);
			onSnapshot(itemsRef, (querySnapshot) => {
				const itemsData = querySnapshot.docs.map((doc) => {
					return {
						itemId: doc.id,
						postId: doc.data().postId,
						itemImg: doc.data().itemImg,
						itemName: doc.data().itemName,
						price: doc.data().price,
						shopName: doc.data().shopName,
						itemUrl: doc.data().itemUrl,
					};
				});
				setItems(itemsData);
			});
		}
		setIsLoading(false);
	}, [router.isReady, router.query.userId]);

	//useFetchDataでreturnされたobjectのvalue
	const { fetching, result, handleSubmit } = useFetchData();
	//useFetchDataに渡すstate
	const [value, setValue] = useState({ freeWord: "" });

	//検索フィールド監視
	const handleFreeWord = (event) => {
		setValue({ freeWord: event.target.value });
	};

	//投稿内容をアップロード
	const editPost = async () => {
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
			await addDoc(
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
						<Heading as="h2">ネコルームを編集する</Heading>
						<Spacer />
						<Box>
							<Stack>
								<Image
									src={post.image}
									alt=""
									boxSize="250px"
									objectFit="cover"
								/>
							</Stack>
						</Box>
						<Heading as="h3" size="md">
							テキストを編集する
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
							アイテムを編集する
						</Heading>
						{items?.length >= 1 &&
							items?.map((item) => (
								<HStack
									key={item.itemId}
									bg="white"
									boxShadow="md"
									rounded="md"
									w="140px"
									h="140px"
									justify="center"
								>
									<Image
										alt={item.itemName}
										src={item.itemImg}
										boxSize="100px"
										objectFit="cover"
									/>
								</HStack>
							))}
						{!Object.keys(itemResult).length ? (
							<PrimaryButton
								bg="#ffffff"
								color="gray.900"
								borderColor="gray.300"
								border="1px"
								onClick={onOpen}
							>
								アイテムを再選択
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
										<Link target="_blank">Supported by Rakuten Developers</Link>
									</NextLink>
								</ModalFooter>
							</ModalContent>
						</Modal>
						<Spacer />
						<VStack>
							<PrimaryButton
								bg="#E4626E"
								color="#ffffff"
								onClick={editPost}
								disabled={isLoading}
							>
								ネコルームを変更する
							</PrimaryButton>
							<Spacer />
							<Divider />
							<Spacer />
							<PrimaryButton
								bg="#ffffff"
								color="gray.900"
								border="1px"
								borderColor="gray.300"
								onClick={onOpen}
								disabled={isLoading}
							>
								ネコルームを削除する
							</PrimaryButton>
							<Modal isOpen={isOpen} onClose={onClose}>
								<ModalOverlay />
								<ModalContent>
									<ModalHeader mt={6}>
										<VStack>
											<Text fontSize="md">
												本当にこのネコルームを削除しますか？
											</Text>
											<Text fontSize="xs" color="#E4626E">
												※この操作は取り消せません
											</Text>
										</VStack>
									</ModalHeader>
									<ModalCloseButton />
									<ModalBody>
										<HStack justify="space-between">
											<Button
												borderColor="gray.300"
												border="1px"
												bg="white"
												color="gray.900"
												size="md"
												onClick={() => onClose()}
												w="150px"
											>
												キャンセル
											</Button>
											<Button
												bg="#E4626E"
												color="white"
												size="md"
												_hover={{ bg: "#E4626E", color: "#ffffff" }}
												onClick={() => onClose()}
												w="150px"
											>
												削除する
											</Button>
										</HStack>
									</ModalBody>
									<ModalFooter></ModalFooter>
								</ModalContent>
							</Modal>
						</VStack>
					</VStack>
				</Container>
			) : (
				<Loading />
			)}

			<Footer />
		</>
	);
};

export default PostEdit;
