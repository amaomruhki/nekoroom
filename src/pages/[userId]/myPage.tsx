import { useEffect, useState } from "react";
import NextLink from "next/link";
import {
	Image,
	Container,
	Heading,
	HStack,
	VStack,
	Text,
	Link,
	Grid,
	AspectRatio,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useRouter } from "next/router";
import { userState } from "../../Atoms/userAtom";
import { useRecoilState } from "recoil";
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
	const [author, setAuthor] = useState([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currentUser] = useRecoilState(userState);
	const router = useRouter();

	//投稿したユーザー情報を取得
	useEffect(() => {
		setIsLoading(true);
		if (router.isReady) {
			const authorId = router.query.userId as string;
			const unsubscribe = onSnapshot(doc(db, "users", authorId), (snapshot) => {
				const userData = {
					userId: snapshot.data()?.uid,
					username: snapshot.data()?.username,
					userImg: snapshot.data()?.userImg,
					text: snapshot.data()?.text,
				};
				setAuthor(userData);
			});
			return () => unsubscribe();
		}
	}, [router.isReady, router.query.userId]);

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
			{!isLoading ? (
				<>
					<VStack bg="white" p={4} rounded="md">
						<HStack p={2}>
							<Avatar size="md" name={author.username} src={author.userImg} />
							<Text fontSize="md" as="b">
								{author.username}
							</Text>
						</HStack>
						<Text fontSize="sm">{author.text}</Text>
						{currentUser && currentUser!.uid === author.userId ? (
							<NextLink
								href={{
									pathname: "/[userId]/myProfileEdit",
									query: {
										userId: router.query.userId,
										postId: router.query.postId,
									},
								}}
								as={`/${router.query.userId}/myProfileEdit`}
								passHref
							>
								<Link>
									<Text
										as="u"
										cursor="pointer"
										color="#E4626E"
										_hover={{ opacity: 0.8 }}
									>
										プロフィールを編集する
									</Text>
								</Link>
							</NextLink>
						) : null}
					</VStack>
					<VStack align="left" spacing={4} my={4}>
						<Heading as="h3" size="md">
							{author.username}の投稿
						</Heading>
					</VStack>
					<Grid
						templateColumns="repeat(4, 1fr)"
						gridTemplateRows="repeat(4, 1fr)"
						gap={1}
					>
						{posts
							? posts.map((post) => (
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
												alt={`${author.username}'s photo`}
												src={post.image}
												objectFit="cover"
											/>
										</AspectRatio>
									</NextLink>
							  ))
							: null}
					</Grid>
				</>
			) : (
				<Loading />
			)}
		</>
	);
};

export default MyPage;
