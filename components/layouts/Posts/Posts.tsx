import { Grid } from "@chakra-ui/react";
import { useState } from "react";
import Post from "./Post";

type Post = {
	id: string;
	username: string;
	userImg: string;
	img: string;
	caption: string;
};

const Posts: React.FC = () => {
	// const [posts, setPosts] = useState<Post[] | null>(null);
	// const posts = null;
	const posts = [
		{
			id: "1",
			username: "Kent Dodds",
			userImg: "../../public/dummyuser.jp",
			img: "https://images.unsplash.com/photo-1622763853951-ded5a33cb724?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGNhdCUyMGhvbWV8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
			caption:
				"My pretty cat, Kurosiro!My pretty cat, Kurosiro!My pretty cat, Kurosiro!",
		},
		{
			id: "2",
			username: "9646",
			userImg: "https://bit.ly/kent-c-dodds",
			img: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2187&q=80",
			caption:
				"Kurosiro is top of cat in the world!Kurosiro is top of cat in the world!Kurosiro is top of cat in the world!Kurosiro is top of cat in the world!Kurosiro is top of cat in the world!",
		},
		{
			id: "3",
			username: "Kent Dodds",
			userImg: "../../public/dummyuser.jp",
			img: "https://images.unsplash.com/photo-1501820488136-72669149e0d4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
			caption:
				"My pretty cat, Kurosiro!My pretty cat, Kurosiro!My pretty cat, Kurosiro!",
		},
		{
			id: "4",
			username: "9646",
			userImg: "https://bit.ly/kent-c-dodds",
			img: "https://images.unsplash.com/photo-1566765790386-c43812572bc2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80",
			caption: "Kurosiro is top of cat in the world!",
		},
	];

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
						img={post.img}
						caption={post.caption}
					/>
				))}
		</Grid>
	);
};

export default Posts;
