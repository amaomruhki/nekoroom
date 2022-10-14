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
} from "@chakra-ui/react";
import Link from "next/link";

type Props = {
	onClose: () => void;
	isOpen: boolean;
};

const MenuDrawer = ({ isOpen, onClose }: Props) => {
	const { height } = useWindowSize();
	const menuList = [
		{ url: "/", text: "トップ" },
		{ url: "/login", text: "ログイン" },
		{ url: "/register", text: "新規登録" },
		{ url: "/photoupload", text: "投稿" },
		{ url: "/postdetail", text: "投稿詳細" },
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
							{menuList.map(({ url, text }) => (
								<Box key={text}>
									<Link href={url}>{text}</Link>
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
