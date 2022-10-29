import { Grid } from "@chakra-ui/react";
import {
	collection,
	collectionGroup,
	getDoc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	doc,
	where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../../lib/firebase";
import Post from "./Post";

type Post = {
	postId: string;
	username: string;
	userImg: string;
	image: string;
	caption: string;
};

const Posts = () => {
	const [posts, setPosts] = useState<Post[] | null>(null);

	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(collectionGroup(db, "posts")),
			(snapshot) => {
				Promise.all(
					snapshot.docs.map(async (document) => {
						// ユーザーデータ取得
						const userId = document.data().userId;
						const userRef = doc(db, "users", userId);
						const userInfo = await getDoc(userRef);

						return {
							...document.data(),
							postId: document.id,
							username: userInfo.data().username,
							userImg: userInfo.data().userImg,
							image: document.data().image,
							caption: document.data().caption,
						};
					})
				).then((data) => {
					data;
					setPosts(data);
				});
			}
		);
		return () => unsubscribe();
	}, []);

	return (
		<Grid
			templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
			gap={1}
		>
			{/* ポストが存在してたら表示 */}
			{posts &&
				posts.map((post) => (
					<Post
						key={post.id}
						id={post.id}
						username={post.username}
						userImg={post.userImg}
						image={post.image}
						caption={post.caption}
					/>
				))}
		</Grid>
	);
};

export default Posts;
