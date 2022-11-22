import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import {
	Image,
	Box,
	Heading,
	HStack,
	VStack,
	Text,
	Textarea,
	Button,
	Stack,
	Icon,
	Flex,
	Spacer,
	Center,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	Link,
	IconButton,
	AspectRatio,
	GridItem,
	Grid,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import { PadIcon } from "../../../components/elements/Icon/Icon";
import {
	addDoc,
	collection,
	writeBatch,
	increment,
	doc,
	getDoc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	Timestamp,
	where,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useRouter } from "next/router";
import {
	convertSubstring,
	parseTimestampToDate,
} from "../../../utils/DataFormat";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import PrimaryButton from "../../../components/elements/Button/PrimaryButton";
import Loading from "../../../components/elements/Loading/Loading";
import { userState } from "../../../Atoms/userAtom";
import { useRecoilState } from "recoil";

type CommentUser =
	| {
			commentId: string;
			commentedUserId?: string;
			comment: string;
			commentedUsername: string;
			commentedUserImg: string;
			createTime: Timestamp;
	  }
	| undefined;

type Post = {
	postId: string;
	image: string;
	caption: string;
	likeCount: number;
	createTime: Timestamp;
	userId: string;
	username: string;
	userImg: string;
};

type Item = {
	itemId: string;
	postId: string;
	itemImg: string;
	itemName: string;
	price: string;
	shopName: string;
	itemUrl: string;
};

type LikeUsers = {
	id: string;
	likeUserId: any;
	postId: any;
};

const PostDetail = () => {
	const [items, setItems] = useState<Item[] | null>(null);
	const [post, setPost] = useState<Post | null>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [comment, setComment] = useState<string>("");
	const [comments, setComments] = useState<CommentUser[] | null>(null);
	const [likeUsers, setLikeUsers] = useState<LikeUsers[] | null>(null);
	const [currentUser] = useRecoilState(userState);
	const router = useRouter();

	//投稿した記事情報を取得
	useEffect(() => {
		setIsLoading(true);
		if (!router.isReady) return;
		const { userId: authorId, postId } = router.query;
		const unsubscribe = onSnapshot(
			doc(db, "users", authorId as string, "posts", postId as string),
			async (snapshot) => {
				const authorData = await getDoc(doc(db, "users", authorId as string));
				const postData = {
					postId: snapshot.data()?.postId,
					userId: snapshot.data()?.userId,
					image: snapshot.data()?.image,
					caption: snapshot.data()?.caption,
					likeCount: snapshot.data()?.likeCount,
					createTime: snapshot.data()?.createTime,
					username: authorData.data()?.username,
					userImg: authorData.data()?.userImg,
				};
				setPost(postData);
			}
		);
		setIsLoading(false);
		return () => unsubscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router, router.query]);

	//アイテム取得
	useEffect(() => {
		if (!post) return;
		const itemsRef = query(
			collection(db, "users", post.userId, "posts", post.postId, "items"),
			where("postId", "==", post.postId)
		);
		const unsub = onSnapshot(itemsRef, (querySnapshot) => {
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
		return () => unsub();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [post]);

	//投稿に対してlikeしたユーザーを絞り込んで取得
	useEffect(() => {
		if (!post || !currentUser) return;
		const loginUserId = currentUser.uid;
		const likeUsersRef = query(
			collection(db, "users", loginUserId, "likeUsers"),
			where("postId", "==", post.postId)
		);
		const unsub = onSnapshot(likeUsersRef, (querySnapshot) => {
			const likeUsersData = querySnapshot.docs.map((doc) => {
				return {
					...doc.data(),
					id: doc.id,
					likeUserId: doc.data().likeUserId,
					postId: doc.data().postId,
				};
			});
			setLikeUsers(likeUsersData);
		});
		return () => unsub();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [post]);

	// コメントの取得
	useEffect(() => {
		if (!post) return;

		const unsub = onSnapshot(
			query(
				collection(db, "users", post.userId, "posts", post.postId, "comments"),
				orderBy("createTime", "desc")
			),
			(snapshot) => {
				Promise.all(
					snapshot.docs.map(async (document) => {
						// コメントユーザーデータ取得
						const commentedUserId = document.data().commentedUserId;
						const commentedUserRef = doc(db, "users", commentedUserId);
						const commentedUserInfo = await getDoc(commentedUserRef);

						return {
							...document.data(),
							commentId: document.id,
							commentedUsername: commentedUserInfo.data()?.username,
							commentedUserImg: commentedUserInfo.data()?.userImg,
							comment: document.data().comment,
							createTime: document.data().createTime,
						};
					})
				).then((data) => {
					setComments(data);
				});
			}
		);

		return () => unsub();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router, post, likeUsers]);

	// コメント投稿
	const sendComment = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (!post || !currentUser) return;
		const { userId, postId } = post;
		const commentedUserId = currentUser.uid;

		setComment("");
		await addDoc(collection(db, "users", userId, "posts", postId, "comments"), {
			comment,
			commentedUserId,
			createTime: serverTimestamp(),
		});
	};

	//like（いいにゃ）のカウントを増減処理(posts,likePosts,likeUsersをバッチ処理)
	const handleLikeCount = async () => {
		if (!post || !currentUser) return;
		const batch = writeBatch(db);
		const { userId, postId } = post;
		const loginUserId = currentUser.uid;
		const postRef = doc(db, "users", userId, "posts", postId);
		const postInfo = await getDoc(postRef);
		const likePostsDoc = doc(db, "users", loginUserId, "likePosts", postId);
		const likeUsersDoc = doc(db, "users", loginUserId, "likeUsers", postId);
		const { v4: uuidv4 } = require("uuid");

		//likeがゼロの場合
		if (postInfo.data()!.likeCount === 0) {
			batch.set(likePostsDoc, {
				likePostAuthorId: userId,
				postId: postId,
				createTime: serverTimestamp(),
			});

			batch.set(likeUsersDoc, {
				likeUserId: loginUserId,
				key: uuidv4(), //map用key
				postId,
				createTime: serverTimestamp(),
			});
			batch.update(postRef, { likeCount: increment(1) });
		} else {
			// ログインuserがlikeしている場合、likeを取り消す
			if (likeUsers && likeUsers.length > 0) {
				batch.delete(likePostsDoc);
				batch.delete(likeUsersDoc);
				batch.update(postRef, { likeCount: increment(-1) });
			} else {
				//ログインuserがlikeしていない場合、likeを追加
				batch.set(likePostsDoc, {
					likePostAuthorId: userId,
					postId,
					createTime: serverTimestamp(),
				});

				batch.set(likeUsersDoc, {
					likeUserId: loginUserId,
					key: uuidv4(), //map用key
					postId,
					createTime: serverTimestamp(),
				});

				batch.update(postRef, { likeCount: increment(1) });
			}
		}
		batch.commit();
	};

	return (
		<>
			{!isLoading && post ? (
				<Grid
					templateColumns={{
						sm: "repeat(1, 1fr)",
						md: "repeat(1, 1fr)",
					}}
					gap={2}
				>
					<GridItem maxW="420px">
						{currentUser && currentUser.uid === post.userId ? (
							<Stack m={4}>
								<NextLink
									href={{
										pathname: "/[userId]/[postId]/postEdit",
										query: {
											userId: post.userId,
											postId: post.postId,
										},
									}}
									as={`/${post.userId}/${post.postId}/postEdit`}
									passHref
								>
									<Button
										as="a"
										bg="#ffffff"
										color="#E4626E"
										borderColor="#E4626E"
										border="1px"
										_hover={{ color: "#ffffff", bg: "#E4626E" }}
									>
										投稿を編集する
									</Button>
								</NextLink>
							</Stack>
						) : null}
						<Box bg="white" p={4} rounded="md" boxShadow="md">
							<AspectRatio ratio={1 / 1}>
								<Image
									src={post.image}
									alt={`${post.username}'s photo`}
									objectFit="cover"
								/>
							</AspectRatio>
							<Flex alignItems="center" gap="2">
								<HStack p={2}>
									<NextLink
										href={{
											pathname: "/[userId]/myPage",
											query: {
												userId: post.userId,
												postId: post.postId,
											},
										}}
										as={`/${post.userId}/myPage`}
									>
										<Avatar size="md" name={post.username} src={post.userImg} />
									</NextLink>
									<VStack align="left">
										<Text fontSize="md" as="b">
											{post.username}
										</Text>
										<Text fontSize="sm">
											{parseTimestampToDate(post.createTime, "/")}
										</Text>
									</VStack>
								</HStack>
								<Spacer />
								{/* like表示の条件分岐 */}
								<HStack spacing={2}>
									{currentUser && likeUsers ? (
										likeUsers.length > 0 ? (
											<IconButton
												p={0}
												aria-label="like"
												variant="ghost"
												icon={<PadIcon />}
												color="#E4626E"
												fontSize="30px"
												sx={{ margin: "-4px" }}
												onClick={() => handleLikeCount()}
											/>
										) : (
											<IconButton
												p={0}
												aria-label="like"
												variant="ghost"
												icon={<PadIcon />}
												color="#d6d6d6"
												fontSize="30px"
												sx={{ margin: "-4px" }}
												onClick={() => handleLikeCount()}
											/>
										)
									) : (
										<Icon
											as={PadIcon}
											color="#d6d6d6"
											sx={{ width: "30px", height: "30px" }}
										/>
									)}
									<Text as="b" fontSize="xs" color="#d6d6d6">
										{post.likeCount}
									</Text>
								</HStack>
							</Flex>
							<Text fontSize="md">{post.caption}</Text>
						</Box>
						<VStack
							w="100%"
							maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "30vw" }}
							pb={100}
							mt={4}
							align="left"
						>
							{items && items.length >= 1 && (
								<>
									<Heading as="h3" fontSize="md">
										使用アイテム
									</Heading>
									<Flex gap={2}>
										{items.map((item) => (
											<React.Fragment key={item.itemId}>
												<HStack
													bg="white"
													boxShadow="md"
													rounded="md"
													w="140px"
													h="140px"
													justify="center"
													onClick={onOpen}
													cursor="pointer"
												>
													<Image
														alt={item.itemName}
														src={item.itemImg}
														boxSize="100px"
														objectFit="cover"
													/>
												</HStack>
												<Modal isOpen={isOpen} onClose={onClose}>
													<ModalOverlay />
													<ModalContent>
														<ModalHeader mt={6}></ModalHeader>
														<ModalCloseButton />
														<ModalBody>
															<Stack p={2} m="4px">
																<Stack align="center">
																	<Image
																		alt={item.itemUrl}
																		src={item.itemImg}
																		boxSize="250px"
																		objectFit="cover"
																	/>
																</Stack>
																<Text fontSize="md" color="gray.500">
																	{convertSubstring(item.shopName, 50)}
																</Text>
																<Text fontSize="md" as="b">
																	￥{item.price.toLocaleString()}
																</Text>
																<Text fontSize="md">
																	{convertSubstring(item.itemName, 100)}
																</Text>
																<Button
																	as="a"
																	href={item.itemUrl}
																	target="_blank"
																	borderColor="#E4626E"
																	border="1px"
																	bg="#ffffff"
																	color="#E4626E"
																	size="md"
																	_hover={{ bg: "#E4626E", color: "#ffffff" }}
																	leftIcon={<ExternalLinkIcon />}
																>
																	楽天市場で見る
																</Button>
															</Stack>
														</ModalBody>
														<ModalFooter>
															<NextLink
																href="https://developers.rakuten.com/"
																passHref
															>
																<Link target="_blank">
																	Supported by Rakuten Developers
																</Link>
															</NextLink>
														</ModalFooter>
													</ModalContent>
												</Modal>
											</React.Fragment>
										))}
									</Flex>
								</>
							)}
							<Heading as="h3" fontSize="md">
								コメント
							</Heading>
							{comments && comments.length === 0 && (
								<Text>コメントはありません</Text>
							)}
							{currentUser && (
								<>
									<Textarea
										bg="white"
										placeholder="コメントを入力してください"
										value={comment}
										onChange={(event) => setComment(event.target.value)}
									/>
									<Center>
										<PrimaryButton
											bg="#ffffff"
											color="gray.900"
											borderColor="gray.300"
											border="1px"
											onClick={sendComment}
											disabled={!comment.trim()}
										>
											コメントする
										</PrimaryButton>
									</Center>
								</>
							)}
							<VStack spacing={4}>
								{comments &&
									comments.map((comment) => (
										<Box
											w="100%"
											maxW={{
												base: "90vw",
												sm: "80vw",
												lg: "50vw",
												xl: "30vw",
											}}
											bg="white"
											p={4}
											rounded="md"
											key={comment?.commentId}
										>
											<HStack>
												<Avatar
													size="sm"
													name={comment?.commentedUsername}
													src={comment?.commentedUserImg}
												/>
												<HStack alignItems="center">
													<Text fontSize="md" as="b">
														{comment?.commentedUsername}
													</Text>
													<Text fontSize="sm">
														{comment &&
															parseTimestampToDate(comment.createTime, "/")}
													</Text>
												</HStack>
											</HStack>
											<Text>{comment?.comment}</Text>
										</Box>
									))}
							</VStack>
						</VStack>
					</GridItem>
				</Grid>
			) : (
				<Loading />
			)}
		</>
	);
};

export default PostDetail;
