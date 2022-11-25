import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Image, Heading, VStack, Grid, AspectRatio } from "@chakra-ui/react";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	Timestamp,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useRouter } from "next/router";
import { userState } from "../../Atoms/userAtom";
import { useRecoilState } from "recoil";
import Loading from "../../components/elements/Loading/Loading";

type Post =
	| {
			image: string;
			postId: string;
			userId: string;
			caption: string;
			likeCount: number;
			createTime: Timestamp;
	  }
	| undefined;

const MyLike = () => {
	const [myLikes, setMyLikes] = useState<Post[] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currentUser] = useRecoilState(userState);
	const router = useRouter();

	// likeした投稿の取得
	useEffect(() => {
		setIsLoading(true);
		if (!router.isReady) return;
		const { userId } = router.query;
		// アロー関数入れてしまうと、関数の中に入ると実行できない、クリーンアップ時に始めて実行
		const unsubscribe = onSnapshot(
			query(
				collection(db, "users", userId as string, "likePosts"),
				orderBy("createTime", "desc")
			),
			(snapshot) => {
				Promise.all(
					snapshot.docs.map(async (document) => {
						const likePostId = document.data().postId;
						const likePostAuthorId = document.data().likePostAuthorId;
						if (!likePostId) return;
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
					})
				).then((data) => {
					setMyLikes(data);
				});
			}
		);

		setIsLoading(false);
		return () => unsubscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router, router.query]);

	return (
		<>
			{!isLoading && currentUser ? (
				<>
					<VStack align="left" spacing={4} mb={2}>
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
										myLike?.image && (
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
				</>
			) : (
				<Loading />
			)}
		</>
	);
};

export default MyLike;
