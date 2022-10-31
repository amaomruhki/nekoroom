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
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import { PadIcon } from "../../../components/elements/Icon/Icon";
import {
	collection,
	collectionGroup,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	Timestamp,
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

const Postdetail = () => {
	const [postDetail, setPostDetail] = useState([]);
	const [items, setItems] = useState();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

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
					createTime: postSnap.data().createTime as Timestamp,
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
							<Icon
								as={PadIcon}
								color="#d6d6d6"
								w={8}
								h={8}
								_hover={{ color: "#E4626E" }}
							/>
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
						<Heading as="h3" fontSize="md">
							コメント
						</Heading>
						<Textarea
							bg="white"
							placeholder="コメントを入力してください"
						></Textarea>
						<Center>
							<PrimaryButton
								bg="#ffffff"
								color="gray.900"
								borderColor="gray.300"
								border="1px"
								onClick={onClose}
							>
								コメントする
							</PrimaryButton>
						</Center>
						<VStack spacing={4} pt={6}>
							<Box bg="white" p={4} rounded="md">
								<HStack p={2}>
									<Avatar
										size="sm"
										name="Kent Dodds"
										src="https://bit.ly/kent-c-dodds"
									/>
									<HStack alignItems="center">
										<Text fontSize="md" as="b">
											Kent Dodds
										</Text>
										<Text fontSize="sm">2022/10/03 19:00</Text>
									</HStack>
								</HStack>
								<Text>
									ここにコメントが入りますここにコメントが入りますここにコメントが入ります
								</Text>
							</Box>
							<Box bg="white" p={4} rounded="md">
								<HStack p={2}>
									<Avatar size="sm" name="dummy" src="dummy" />
									<HStack alignItems="center">
										<Text fontSize="md" as="b">
											Kent Dodds
										</Text>
										<Text fontSize="sm">2022/10/03 19:00</Text>
									</HStack>
								</HStack>
								<Text>
									ここにコメントが入りますここにコメントが入りますここにコメントが入ります
								</Text>
							</Box>
							<Box bg="white" p={4} rounded="md">
								<HStack p={2}>
									<Avatar
										size="sm"
										name="Kent Dodds"
										src="https://bit.ly/kent-c-dodds"
									/>
									<HStack alignItems="center">
										<Text fontSize="md" as="b">
											Kent Dodds
										</Text>
										<Text fontSize="sm">2022/10/03 19:00</Text>
									</HStack>
								</HStack>
								<Text>
									ここにコメントが入りますここにコメントが入りますここにコメントが入ります
								</Text>
							</Box>
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
