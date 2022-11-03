import { useEffect, useState } from "react";
import Footer from "../../../components/layouts/Footer/Footer";
import Header from "../../../components/layouts/Header/Header";
import NextLink from "next/link";
import {
	Image,
	Box,
	Container,
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
	getDocs,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	Timestamp,
	where,
	collectionGroup,
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
import { uuid } from "uuidv4";

type CommentUser = {
	commentedUserId: string;
	comment: string;
	commentedUsername: string;
	commentedUserImg: string;
	createTime: Timestamp;
};

const Postdetail = () => {
	const [postDetail, setPostDetail] = useState([]);
	const [items, setItems] = useState();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState<CommentUser[] | null>(null);
	const [likeUsers, setLikeUsers] = useState([]);
	const [currentUser] = useRecoilState(userState);
	const router = useRouter();

	// 投稿内容取得
	useEffect(() => {
		setIsLoading(true);
		const docRef = async () => {
			if (router.isReady) {
				const userId = router.query.userId;
				const userRef = doc(db, "users", userId);
				const userSnap = await getDoc(userRef);

				const postId = router.query.postId;
				const postRef = doc(userRef, "posts", postId);
				const postSnap = await getDoc(postRef);

				const postInfo = {
					userId: userId,
					postId: postId,
					username: userSnap.data().username,
					userImg: userSnap.data().userImg,
					image: postSnap.data().image,
					caption: postSnap.data().caption,
					createTime: postSnap.data().createTime,
					likeCount: postSnap.data().likeCount,
				};
				setPostDetail(postInfo);

				const itemsSnap = await getDocs(collection(postRef, "items"));
				const itemsInfo = itemsSnap.docs.map((doc) => ({
					...doc.data(),
					itemId: doc.id,
					postId: doc.data().postId,
					itemImg: doc.data().itemImg,
					itemName: doc.data().itemName,
					price: doc.data().price,
					shopName: doc.data().shopName,
					itemUrl: doc.data().itemUrl,
				}));
				setItems(itemsInfo);
			}
		};
		setIsLoading(false);
		docRef();
	}, [router.isReady, router.query.userId]);

	//投稿に対してlikeしたユーザーを絞り込んで取得
	useEffect(() => {
		if (router.isReady && currentUser) {
			const postId = router.query.postId;
			const loginUserId = currentUser!.uid;
			const likeUsersRef = query(
				collection(db, "users", loginUserId, "likeUsers"),
				where("postId", "==", postId)
			);
			onSnapshot(likeUsersRef, (querySnapshot) => {
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
		}
	}, [router.isReady, router.query.userId]);

	// コメントの取得
	useEffect(() => {
		setIsLoading(true);
		const unsubscribe = () => {
			if (router.isReady) {
				const userId = router.query.userId;
				const postId = router.query.postId;
				onSnapshot(
					query(
						collection(db, "users", userId, "posts", postId, "comments"),
						orderBy("createTime", "desc")
					),
					(snapshot) => {
						Promise.all(
							snapshot.docs.map(async (document) => {
								// コメントユーザーデータ取得
								const commentedUserId = document.data().commentedUserId;
								if (commentedUserId) {
									const commentedUserRef = doc(db, "users", commentedUserId);
									const commentedUserInfo = await getDoc(commentedUserRef);
									return {
										...document.data(),
										commentedUsername: commentedUserInfo.data().username,
										commentedUserImg: commentedUserInfo.data().userImg,
										comment: document.data().comment,
										createTime: document.data().createTime,
									};
								}
							})
						).then((data) => {
							data;
							setComments(data);
						});
					}
				);
			}
		};
		setIsLoading(false);
		return () => unsubscribe();
	}, []);

	// コメント投稿
	async function sendComment(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		const commentToSend = comment;
		const commentedUserUid = currentUser?.uid;
		const userId = router.query.userId;
		const postId = router.query.postId;

		setComment("");
		await addDoc(collection(db, "users", userId, "posts", postId, "comments"), {
			comment: commentToSend,
			commentedUserId: commentedUserUid,
			createTime: serverTimestamp(),
		});
	}

	//like（いいにゃ）のカウントを増減処理(posts,likePosts,likeUsersをバッチ処理)
	const handleLikeCount = async (postDetail) => {
		const batch = writeBatch(db);
		const postId = postDetail.postId;
		const authorId = postDetail.userId;
		const loginUserId = currentUser!.uid;
		const postRef = doc(db, "users", authorId, "posts", postId);
		const likePostsDoc = doc(db, "users", loginUserId, "likePosts", postId);
		const likeUsersDoc = doc(db, "users", loginUserId, "likeUsers", postId);
		const { v4: uuidv4 } = require("uuid");

		//likeがゼロの場合
		if (postDetail.likeCount === 0) {
			batch.set(likePostsDoc, {
				likePostAuthorId: authorId,
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
		} else {
			// ログインuserがlikeしている場合、likeを取り消す
			if (likeUsers.length > 0) {
				batch.delete(likePostsDoc);
				batch.delete(likeUsersDoc);
				batch.update(postRef, { likeCount: increment(-1) });
			} else {
				//ログインuserがlikeしていない場合、likeを追加
				batch.set(likePostsDoc, {
					likePostAuthorId: authorId,
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
			<Header />
			{!isLoading ? (
				<Container pt={8} pb={8} mt="50px">
					<Box maxW="420px" bg="white" p={4} rounded="md" boxShadow="md">
						<Image
							src={postDetail.image}
							boxSize="400px"
							alt={`${postDetail.username}'s photo`}
							objectFit="cover"
						/>
						<Flex alignItems="center" gap="2">
							<HStack p={2}>
								<Avatar
									size="md"
									name={postDetail.username}
									src={postDetail.userImg}
								/>
								<VStack align="left">
									<Text fontSize="md" as="b">
										{postDetail.username}
									</Text>
									<Text fontSize="sm">
										{parseTimestampToDate(postDetail.createTime, "/")}
									</Text>
								</VStack>
							</HStack>
							<Spacer />
							{/* like表示の条件分岐 */}
							<HStack spacing={2}>
								{currentUser ? (
									likeUsers.length > 0 ? (
										<IconButton
											p={0}
											aria-label="like"
											variant="ghost"
											icon={<PadIcon />}
											color="#E4626E"
											fontSize="30px"
											sx={{ margin: "-4px" }}
											onClick={() => handleLikeCount(postDetail)}
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
											onClick={() => handleLikeCount(postDetail)}
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
									{postDetail.likeCount}
								</Text>
							</HStack>
						</Flex>
						<Text fontSize="md">{postDetail.caption}</Text>
					</Box>
					<VStack
						w="100%"
						maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "30vw" }}
						pb={100}
						mt={4}
						align="left"
					>
						{/* <HStack p={1}>
						<Button variant="outline" bg="#ffffff" color="gray.900">
							キャットタワー
						</Button>
						<Button variant="outline" bg="#ffffff" color="gray.900">
							部屋全体
						</Button>
					</HStack> */}
						{items?.length >= 1 && (
							<>
								<Heading as="h3" fontSize="md">
									使用アイテム
								</Heading>
								<Flex gap={2}>
									{items?.map((item) => (
										<>
											<HStack
												bg="white"
												boxShadow="md"
												rounded="md"
												w="140px"
												h="140px"
												justify="center"
												key={item.itemName}
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
																	src={item.imageUrl}
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
															<Link>Supported by Rakuten Developers</Link>
														</NextLink>
													</ModalFooter>
												</ModalContent>
											</Modal>
										</>
									))}
								</Flex>
							</>
						)}
						<Heading as="h3" fontSize="md">
							コメント
						</Heading>
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
							{comments?.map((comment) => (
								<Box
									w="100%"
									maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "30vw" }}
									bg="white"
									p={4}
									rounded="md"
									key={comment.commentedUserId}
								>
									<HStack>
										<Avatar
											size="sm"
											name={comment.commentedUserId}
											src={comment.commentedUserImg}
										/>
										<HStack alignItems="center">
											<Text fontSize="md" as="b">
												{comment.commentedUsername}
											</Text>
											<Text fontSize="sm">
												{parseTimestampToDate(comment.createTime, "/")}
											</Text>
										</HStack>
									</HStack>
									<Text>{comment.comment}</Text>
								</Box>
							))}
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

export default Postdetail;