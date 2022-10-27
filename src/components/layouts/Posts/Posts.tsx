import { Grid } from "@chakra-ui/react";
import {
	collection,
	collectionGroup,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../../lib/firebase";
import Post from "./Post";

type Post = {
	id: string;
	username: string;
	userImg: string;
	image: string;
	caption: string;
};

const Posts = () => {
	const [posts, setPosts] = useState<Post[] | null>(null);

	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(collectionGroup(db, "users"), orderBy("updateTime", "desc")),
			(snapshot) => {
				const postsData: Post[] = snapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.data().posts.id,
					username: doc.data().username,
					userImg: doc.data().userImg,
					image: doc.data().posts.image,
					caption: doc.data().posts.caption,
				}));
				setPosts(postsData);
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
