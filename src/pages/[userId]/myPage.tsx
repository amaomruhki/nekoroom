import { useEffect, useState } from "react";
import Footer from "../../components/layouts/Footer/Footer";
import Header from "../../components/layouts/Header/Header";
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
	Grid,
	AspectRatio,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
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
import { db } from "../../../lib/firebase";
import { useRouter } from "next/router";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { userState } from "../../Atoms/userAtom";
import { useRecoilState } from "recoil";
import { uuid } from "uuidv4";
import Loading from "../../components/elements/Loading/Loading";

type Post = {
	image: string;
	postId: string;
	userId: string;
	caption: string;
	likeCount: number;
};

const MyPage = () => {
	const [posts, setPosts] = useState<Post[] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currentUser] = useRecoilState(userState);
	const router = useRouter();

	//投稿した記事情報を取得
	useEffect(() => {
		setIsLoading(true);
		if (router.isReady) {
			const userId = router.query.userId as string;
			const unsubscribe = onSnapshot(
				query(
					collection(db, "users", userId, "posts"),
					orderBy("createTime", "desc")
				),
				(snapshot) => {
					const postData = snapshot.docs.map((doc) => {
						return {
							userId: userId,
							postId: doc.id,
							image: doc.data().image,
							caption: doc.data().caption,
							likeCount: doc.data().likeCount,
						};
					});
					setPosts(postData);
				}
			);
			setIsLoading(false);
			return () => unsubscribe();
		}
	}, [router.isReady, router.query.userId]);

	return (
		<>
			<Header />
			{!isLoading && currentUser ? (
				<Container minH="100vh">
					<VStack bg="white" p={4} mt="80px" rounded="md">
						<HStack p={2}>
							<Avatar
								size="md"
								name={currentUser.username}
								src={currentUser.userImg}
							/>
							<Text fontSize="md" as="b">
								{currentUser.username}
							</Text>
						</HStack>
						<Text fontSize="sm">
							愛猫くろしろ（MIX/保護猫/♂）のQOL向上のために駆け出したいエンジニア。
							シンプルでナチュラルなデザインの猫グッズでそろえています。
							#猫飼いエンジニアとつながりたいにゃ
						</Text>
						<Link href="/auth/register">
							<Text
								as="u"
								cursor="pointer"
								color="#E4626E"
								_hover={{ opacity: 0.8 }}
							>
								プロフィールを編集する
							</Text>
						</Link>
					</VStack>
					<VStack align="left" spacing={4} my={4}>
						<Heading as="h3" size="md">
							あなたの投稿
						</Heading>
					</VStack>
					<Grid
						templateColumns="repeat(4, 1fr)"
						gridTemplateRows="repeat(4, 1fr)"
						gap={1}
					>
						{posts
							? posts.map((post) => (
									<>
										<NextLink
											key={post.postId}
											href={{
												pathname: "/[userId]/[postId]/postDetail",
												query: { userId: post.userId, postId: post.postId },
											}}
											as={`/${post.userId}/${post.postId}/postDetail`}
										>
											<AspectRatio ratio={1 / 1}>
												<Image
													alt={`${currentUser.username}'s photo`}
													src={post.image}
													objectFit="cover"
												/>
											</AspectRatio>
										</NextLink>
									</>
							  ))
							: null}
					</Grid>
				</Container>
			) : (
				<Loading />
			)}

			<Footer />
		</>
	);
};

export default MyPage;
