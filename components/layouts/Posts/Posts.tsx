import { Grid } from "@chakra-ui/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import Post from "./Post";

type Post = {
	id: string;
	username: string;
	userImg: string;
	image: string;
	caption: string;
};

const Posts: React.FC = () => {
	const [posts, setPosts] = useState<Post[] | null>(null);
	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(collection(db, "posts"), orderBy("timestamp", "desc")),
			(snapshot) => {
				const postsData: Post[] = snapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
					username: doc.data().username,
					userImg: doc.data().userImg,
					image: doc.data().image,
					caption: doc.data().caption,
				}));
				setPosts(postsData);
			}
		);
		return unsubscribe;
	});

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
