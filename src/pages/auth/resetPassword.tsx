// // 投稿内容取得
// useEffect(() => {
// 	setIsLoading(true);
// 	if (router.isReady) {
// 		const authorId = router.query.userId;
// 		const postId = router.query.postId;
// 		const postRef = query(
// 			collection(db, "users", authorId, "posts"),
// 			where("postId", "==", postId)
// 		);
// 		onSnapshot(postRef, (querySnapshot) => {
// 			const postData = querySnapshot.docs.map((doc) => {
// 				return {
// 					postId: doc.data().postId,
// 					image: doc.data().image,
// 					caption: doc.data().caption,
// 					createTime: doc.data().createTime,
// 					likeCount: doc.data().likeCount,
// 				};
// 			});
// 			setPost(postData);
// 		});

// 		// const userRef = query(
// 		// 	collection(db, "users"),
// 		// 	where("uid", "==", authorId)
// 		// );
// 		// onSnapshot(userRef, (querySnapshot) => {
// 		// 	const userData = querySnapshot.docs.map((doc) => {
// 		// 		return {
// 		// 			userId: doc.data().uid,
// 		// 			userImg: doc.data().userImg,
// 		// 			username: doc.data().username,
// 		// 		};
// 		// 	});
// 		// 	setAuthor(userData);
// 		// });
// 	}
// 	setIsLoading(false);
// }, [router.isReady, router.query.userId]);
