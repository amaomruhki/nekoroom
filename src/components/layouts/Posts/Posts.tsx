import { Grid } from "@chakra-ui/react";
import {
	collectionGroup,
	getDoc,
	onSnapshot,
	orderBy,
	query,
	doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../../lib/firebase";
import Post from "./Post";
import Loading from "../../elements/Loading/Loading";

type Post = {
	postId: string;
	userId: string;
	username: string;
	userImg: string;
	image: string;
	caption: string;
	likeCount: number;
};

const Posts = () => {
	const [posts, setPosts] = useState<Post[] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);
		const unsubscribe = onSnapshot(
			query(collectionGroup(db, "posts"), orderBy("createTime", "desc")),
			(snapshot) => {
				Promise.all(
					snapshot.docs.map(async (document) => {
						// ユーザーデータ取得
						const userId = document.data().userId;
						const userRef = doc(db, "users", userId);
						const userInfo: any = await getDoc(userRef);

						return {
							...document.data(),
							userId: userId,
							postId: document.id,
							username: userInfo.data().username,
							userImg: userInfo.data().userImg,
							image: document.data().image,
							caption: document.data().caption,
							likeCount: document.data().likeCount,
						};
					})
				)
					.then((data) => {
						data;
						setPosts(data);
					})
					.finally(() => setIsLoading(false));
			}
		);
		return () => unsubscribe();
	}, []);

	// ローディング状態であればローディングUIを表示する
	if (isLoading) {
		return <Loading />;
	}

	return (
		<Grid
			templateColumns={{
				sm: "repeat(1, 1fr)",
				md: "repeat(3, 1fr)",
			}}
			gap={2}
		>
			{posts
				? posts.map((post) => (
						<Post
							key={post.postId}
							userId={post.userId}
							postId={post.postId}
							username={post.username}
							userImg={post.userImg}
							image={post.image}
							caption={post.caption}
							likeCount={post.likeCount}
						/>
				  ))
				: null}
		</Grid>
	);
};

export default Posts;
