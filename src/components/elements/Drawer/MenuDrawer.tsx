import React from "react";
import NextLink from "next/link";
import Image from "next/image";
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
import { Timestamp } from "firebase/firestore";

type Props = {
	onClose: () => void;
	isOpen: boolean;
	onLogout: () => void;
	currentUser: User | null;
};

type User = {
	name: string;
	email: string;
	uid: string;
	createTime: Timestamp;
	updateTime: Timestamp;
	username: string;
	userImg: string;
	text: string;
};

const MenuDrawer = ({ isOpen, onClose, onLogout, currentUser }: Props) => {
	const { height } = useWindowSize();
	const userId = currentUser?.uid;
	const username = currentUser?.username;
	const userImg = currentUser?.userImg;
	const Login_Menu_List = [
		{
			title: "photoUpload",
			text: (
				<NextLink href="/photoUpload" passHref>
					<Link sx={{ display: "block" }}>投稿</Link>
				</NextLink>
			),
		},
		{
			title: "myPage",
			text: (
				<NextLink
					href={{ pathname: "/[userId]/myPage", query: { userId: userId } }}
					passHref
				>
					<Link sx={{ display: "block" }}>マイページ</Link>
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
					<Link sx={{ display: "block" }}>いいにゃした投稿</Link>
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
			text: (
				<NextLink href="/auth/login" passHref>
					<Link sx={{ display: "block" }}>ログイン</Link>
				</NextLink>
			),
		},
		{
			title: "register",
			text: (
				<NextLink href="/auth/register" passHref>
					<Link sx={{ display: "block" }}>新規登録</Link>
				</NextLink>
			),
		},
	];

	return (
		<>
			<Drawer isOpen={isOpen} size="xs" placement="right" onClose={onClose}>
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
						<Stack>
							{currentUser
								? Login_Menu_List.map((list) => (
										<Box
											key={list.title}
											cursor="pointer"
											onClick={onClose}
											borderBottom="1px"
											borderColor="gray.100"
											py={6}
											fontSize="md"
											as="b"
										>
											{list.text}
										</Box>
								  ))
								: Logout_Menu_List.map((list) => (
										<Box
											key={list.title}
											cursor="pointer"
											onClick={onClose}
											borderBottom="1px"
											borderColor="gray.100"
											py={6}
											fontSize="md"
											as="b"
										>
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
