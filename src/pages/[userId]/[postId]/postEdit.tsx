import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import {
	Box,
	Heading,
	VStack,
	Text,
	Textarea,
	Stack,
	Spacer,
	Image,
	HStack,
	Button,
	Divider,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
} from "@chakra-ui/react";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	onSnapshot,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import { userState } from "../../../Atoms/userAtom";
import { db } from "../../../../lib/firebase";
import { useFetchData } from "../../../Hooks/useFetchData";
import PrimaryButton from "../../../components/elements/Button/PrimaryButton";
import { Loading } from "../../../components/elements/Loading/Loading";
import { ItemAddModal } from "../../../components/elements/ItemAddModal";

type ItemResult = {
	postId: string;
	itemImg: string;
	imageUrl: string;
	itemName: string;
	price: string;
	shopName: string;
	itemUrl: string;
};

type Post = {
	postId: string;
	image: string;
	caption: string;
	likeCount: string;
	itemId: string;
};

const PostEdit = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedButton, setSelectedButton] = useState<string>("");
	const cancelRef = useRef(null);
	const [itemResult, setItemResult] = useState<ItemResult | any>({});
	const [items, setItems] = useState<ItemResult | any>({});
	const [post, setPost] = useState<Post | null>(null);
	const [currentUser] = useRecoilState(userState);
	const router = useRouter();

	//アイテム選択モーダルと投稿削除モーダルの出し分け
	const onOpenDialog = (name: string) => {
		setSelectedButton(name);
	};

	const onCloseDialog = () => {
		setSelectedButton("");
	};

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
						itemId: snapshot.data()?.itemId,
					};
					setPost(postData);
				}
			);
			return () => unsubscribe();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady, router.query.userId]);

	//useFetchDataでreturnされたobjectのvalue
	const { fetching, result, handleSubmit } = useFetchData();
	//useFetchDataに渡すstate
	const [value, setValue] = useState({ freeWord: "" });

	//検索フィールド監視
	const handleFreeWord = (event: any) => {
		setValue({ freeWord: event.target.value });
	};

	//投稿内容をアップロード
	const editPost = async () => {
		setIsLoading(true);
		if (!router.isReady) return;
		const authorId = router.query.userId as string;
		const postId = router.query.postId as string;
		setIsLoading(true);
		await updateDoc(doc(db, "users", authorId, "posts", postId), {
			caption: post?.caption,
			updateTime: serverTimestamp(),
		});

		if (Object.keys(itemResult).length != 0) {
			const postRef = await getDoc(doc(db, "users", authorId, "posts", postId));
			const itemId = await postRef.data()?.itemId;
			if (itemId) {
				const itemRef = doc(
					db,
					"users",
					authorId,
					"posts",
					postId,
					"items",
					itemId
				);
				await updateDoc(itemRef, {
					itemImg: itemResult.imageUrl,
					itemName: itemResult.itemName,
					price: itemResult.price,
					shopName: itemResult.shopName,
					itemUrl: itemResult.itemUrl,
				});
			} else {
				await addDoc(
					collection(db, "users", authorId, "posts", postId, "items"),
					{
						...itemResult,
						postId: postId,
						itemImg: itemResult.imageUrl,
						itemName: itemResult.itemName,
						price: itemResult.price,
						shopName: itemResult.shopName,
						itemUrl: itemResult.itemUrl,
					}
				);
			}
		}
		setIsLoading(false);
	};

	//投稿削除
	const handleDelete = () => {
		if (isLoading) return;
		if (router.isReady) {
			const authorId = router.query.userId as string;
			const postId = router.query.postId as string;
			setIsLoading(true);
			deleteDoc(doc(db, "users", authorId, "posts", postId));
			setIsLoading(false);
			router.push("/");
		}
	};

	return (
		<>
			{currentUser && !isLoading && post ? (
				<VStack align="left" spacing={4}>
					<Heading as="h2">投稿を編集する</Heading>
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
						value={post.caption}
						onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
							setPost({ ...post, caption: event.target.value });
						}}
					></Textarea>
					<Heading as="h3" size="md">
						アイテムを編集する
					</Heading>
					{items && items?.length >= 1 ? (
						// アイテムが再選択された場合はアイテム表示を差し替える
						Object.keys(itemResult).length ? (
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
						) : (
							items?.map((item: any) => (
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
							))
						)
					) : Object.keys(itemResult).length ? (
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
								onClick={() => onOpenDialog("item")}
							>
								アイテムを選択
							</PrimaryButton>
						) : (
							<PrimaryButton
								bg="#ffffff"
								color="gray.900"
								borderColor="gray.300"
								border="1px"
								onClick={() => onOpenDialog("item")}
							>
								アイテムを変更
							</PrimaryButton>
						)}
						<PrimaryButton
							bg="#ffffff"
							color="gray.900"
							borderColor="gray.300"
							border="1px"
							onClick={() => {
								setItems({});
								setItemResult({});
							}}
						>
							アイテムをリセット
						</PrimaryButton>
					</HStack>
					<ItemAddModal
						onClose={onCloseDialog}
						result={result}
						fetching={fetching}
						handleSubmit={handleSubmit}
						setItemResult={setItemResult}
						value={value}
						setValue={setValue}
						selectedButton={selectedButton}
						handleFreeWord={handleFreeWord}
					/>
					<Spacer />
					<VStack>
						<PrimaryButton
							bg="#E4626E"
							color="#ffffff"
							onClick={editPost}
							disabled={isLoading}
						>
							投稿を変更する
						</PrimaryButton>
						<Spacer />
						<Divider />
						<Spacer />
						<PrimaryButton
							bg="#ffffff"
							color="gray.900"
							border="1px"
							borderColor="gray.300"
							onClick={() => onOpenDialog("delete")}
							disabled={isLoading}
						>
							投稿を削除する
						</PrimaryButton>
						<AlertDialog
							isOpen={"delete" === selectedButton}
							onClose={onCloseDialog}
							leastDestructiveRef={cancelRef}
						>
							<AlertDialogOverlay>
								<AlertDialogContent>
									<AlertDialogHeader>
										<Text fontSize="md" fontWeight="bold">
											投稿の削除
										</Text>
									</AlertDialogHeader>
									<AlertDialogBody>
										<VStack>
											<Text fontSize="md">本当にこの投稿を削除しますか？</Text>
											<Text fontSize="xs" color="#E4626E">
												※この操作は取り消せません
											</Text>
										</VStack>
									</AlertDialogBody>
									<AlertDialogFooter>
										<Button
											borderColor="gray.300"
											border="1px"
											bg="white"
											color="gray.900"
											size="md"
											onClick={onCloseDialog}
											w="150px"
										>
											キャンセル
										</Button>
										<Button
											ml={3}
											bg="#E4626E"
											color="white"
											size="md"
											_hover={{ bg: "#E4626E", color: "#ffffff" }}
											onClick={handleDelete}
											w="150px"
										>
											削除する
										</Button>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialogOverlay>
						</AlertDialog>
					</VStack>
				</VStack>
			) : (
				<Loading />
			)}
		</>
	);
};
export default PostEdit;
