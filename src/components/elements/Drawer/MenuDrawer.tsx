import React from "react";
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
} from "@chakra-ui/react";
import Link from "next/link";

// type Props = {
// 	onClose: () => void;
// 	isOpen: boolean;
// 	onLogout:() => void;
// 	currentUser: User | null;
// };

const MenuDrawer = ({ isOpen, onClose, onLogout, currentUser }) => {
	const { height } = useWindowSize();
	const Login_Menu_List = [
		{
			title: "photoUpload",
			text: <Link href="/photoUpload">投稿</Link>,
		},
		{
			title: "myPage",
			text: <Link href="/myPage">マイページ</Link>,
		},
		{
			title: "settings",
			text: <Link href="/settings">設定</Link>,
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
						<Image src="/logo.svg" alt="logo" width="158px" height="34px" />
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
