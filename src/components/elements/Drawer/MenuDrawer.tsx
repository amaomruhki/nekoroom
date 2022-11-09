import React from "react";
import NextLink from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useWindowSize } from "react-use";
import {
	Stack,
	Box,
	Drawer,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerBody,
	Text,
	HStack,
	Avatar,
	Link,
} from "@chakra-ui/react";

// type Props = {
// 	onClose: () => void;
// 	isOpen: boolean;
// 	onLogout:() => void;
// 	currentUser: User | null;
// };

const MenuDrawer = ({ isOpen, onClose, onLogout, currentUser }) => {
	const { height } = useWindowSize();
	const router = useRouter();
	const userId = currentUser?.uid;
	const username = currentUser?.username;
	const userImg = currentUser?.userImg;
	const Login_Menu_List = [
		{
			title: "photoUpload",
			text: <Link href="/photoUpload">投稿</Link>,
		},
		{
			title: "myPage",
			text: (
				<NextLink
					href={{ pathname: "/[userId]/myPage", query: { userId: userId } }}
					passHref
				>
					<Link>マイページ</Link>
				</NextLink>
			),
		},
		{
			title: "myLike",
			text: (
				<NextLink
					href={{ pathname: "/[userId]/myLike", query: { userId: userId } }}
					passHref
				>
					<Link>いいにゃした投稿</Link>
				</NextLink>
			),
		},
		{
			title: "logout",
			text: <Text onClick={onLogout}>ログアウト</Text>,
		},
	];
	const Logout_Menu_List = [
		{
			title: "login",
			text: <Link href="/auth/login">ログイン</Link>,
		},
		{
			title: "register",
			text: <Link href="/auth//register">新規登録</Link>,
		},
	];

	return (
		<>
			<Drawer
				isOpen={isOpen}
				size={{ base: "full", md: "xs" }}
				placement="right"
				onClose={onClose}
			>
				<DrawerOverlay />
				<DrawerContent maxH={`${height}px`}>
					<DrawerCloseButton color="#d6d6d6" size="lg" />
					<DrawerHeader>
						{currentUser ? (
							<HStack p={2}>
								<Avatar size="md" name={username} src={userImg} />
								<Text fontSize="md" as="b">
									{username}
								</Text>
							</HStack>
						) : (
							<Image src="/logo.svg" alt="logo" width="158px" height="34px" />
						)}
					</DrawerHeader>
					<DrawerBody>
						<Stack spacing="24px">
							{currentUser
								? Login_Menu_List.map((list) => (
										<Box key="title" cursor="pointer">
											{list.text}
										</Box>
								  ))
								: Logout_Menu_List.map((list) => (
										<Box key="title" cursor="pointer">
											{list.text}
										</Box>
								  ))}
						</Stack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default MenuDrawer;
