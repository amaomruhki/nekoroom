import { useEffect, useState } from "react";
import Footer from "../../components/layouts/Footer/Footer";
import Header from "../../components/layouts/Header/Header";
import NextLink from "next/link";
import {
	Image,
	Container,
	Heading,
	HStack,
	VStack,
	Grid,
	AspectRatio,
} from "@chakra-ui/react";
import {
	collection,
	doc,
	getDoc,
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
	const [myLikes, setMyLikes] = useState<Post[] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currentUser] = useRecoilState(userState);
	const router = useRouter();

	// likeした投稿の取得
	useEffect(() => {
		setIsLoading(true);
		const unsubscribe = () => {
			if (router.isReady) {
				const userId = router.query.userId;
				onSnapshot(
					query(
						collection(db, "users", userId, "likePosts"),
						orderBy("createTime", "desc")
					),
					(snapshot) => {
						Promise.all(
							snapshot.docs.map(async (document) => {
								const likePostId = document.data().postId;
								const likePostAuthorId = document.data().likePostAuthorId;
								if (likePostId) {
									const likePostRef = doc(
										db,
										"users",
										likePostAuthorId,
										"posts",
										likePostId
									);
									const likePostInfo = await getDoc(likePostRef);
									return {
										...document.data(),
										postId: likePostInfo.data()?.postId,
										userId: likePostInfo.data()?.userId,
										image: likePostInfo.data()?.image,
										caption: likePostInfo.data()?.caption,
										likeCount: likePostInfo.data()?.likeCount,
										createTime: likePostInfo.data()?.createTime,
									};
								}
							})
						).then((data) => {
							data;
							setMyLikes(data);
						});
					}
				);
			}
		};
		setIsLoading(false);
		return () => unsubscribe();
	}, []);

	return (
		<>
			<Header />
			{!isLoading && currentUser ? (
				<Container minH="100vh" pt="80px">
					<VStack align="left" spacing={4} my={4}>
						<Heading as="h3" size="md">
							{currentUser.username}のいいにゃ一覧
						</Heading>
					</VStack>
					<Grid
						templateColumns="repeat(4, 1fr)"
						gridTemplateRows="repeat(4, 1fr)"
						gap={1}
					>
						{myLikes
							? myLikes.map(
									(myLike) =>
										myLike.image && (
											<NextLink
												key={myLike.postId}
												href={{
													pathname: "/[userId]/[postId]/postDetail",
													query: {
														userId: myLike.userId,
														postId: myLike.postId,
													},
												}}
												as={`/${myLike.userId}/${myLike.postId}/postDetail`}
											>
												<AspectRatio ratio={1 / 1}>
													<Image alt="" src={myLike.image} objectFit="cover" />
												</AspectRatio>
											</NextLink>
										)
							  )
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
