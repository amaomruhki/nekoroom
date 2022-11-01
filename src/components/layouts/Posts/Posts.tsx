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
	writeBatch,
	serverTimestamp,
	increment,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../../lib/firebase";
import Post from "./Post";
import Loading from "../../elements/Loading/Loading";
import { useRecoilState } from "recoil";
import { userState } from "../../../Atoms/userAtom";
import { uuid } from "uuidv4";

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
	const [currentUser] = useRecoilState(userState);

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
						const userInfo = await getDoc(userRef);

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

	//like（いいにゃ）のカウントを増減処理(posts,likePosts,likeUsersをバッチ処理)
	const handleLikeCount = async (post) => {
		const batch = writeBatch(db);
		const postId = post.postId;
		const authorId = post.userId;
		const loginUserId = currentUser!.uid;
		const postRef = doc(db, "users", authorId, "posts", postId);
		const postInfo = await getDoc(postRef);
		// ユーザーがlikeした投稿を参照(ログイン時)
		const likePostsDoc = doc(db, "users", loginUserId, "likePosts", postId);
		const likePostsInfo = await getDoc(likePostsDoc);
		// 投稿をlikeしたユーザーを参照
		const likeUsersDoc = doc(postRef, "likeUsers", postId);
		const likeUsersInfo = await getDoc(likeUsersDoc);

		//likeがゼロの場合
		if (post.likeCount === 0) {
			batch.set(likePostsDoc, {
				likePostAuthorId: authorId,
				postId: postId,
				createTime: serverTimestamp(),
			});

			batch.set(likeUsersDoc, {
				likeUserId: loginUserId,
				key: uuid(), //map用key
				postId: postId,
				createTime: serverTimestamp(),
			});
			batch.update(postRef, { likeCount: increment(1) });
		} else {
			//ログインuserがlikeしている場合、likeを取り消す
			if (likePostsInfo.data().postId === likeUsersInfo.data().postId) {
				batch.delete(likePostsDoc);
				batch.delete(likeUsersDoc);
				batch.update(postRef, { likeCount: increment(-1) });
			} else {
				//ログインuserがlikeしていない場合、likeを追加
				batch.set(likePostsDoc, {
					likePostAuthorId: authorId,
					postId,
					createTime: serverTimestamp(),
				});

				batch.set(likeUsersDoc, {
					likeUserId: loginUserId,
					key: uuid(), //map用key
					postId,
					createTime: serverTimestamp(),
				});

				batch.update(postRef, { likeCount: increment(1) });
			}
		}
		batch.commit();
	};

	return (
		<Grid
			templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
			gap={1}
		>
			{posts && !isLoading ? (
				posts.map((post) => (
					<Post
						key={post.postId}
						userId={post.userId}
						postId={post.postId}
						username={post.username}
						userImg={post.userImg}
						image={post.image}
						caption={post.caption}
						likeCount={post.likeCount}
						handleLikeCount={() => handleLikeCount(post)}
					/>
				))
			) : (
				<Loading />
			)}
		</Grid>
	);
};

export default Posts;
