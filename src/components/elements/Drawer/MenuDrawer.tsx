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
							{currentUser ? (
								<>
									<Box>
										<Link href="/photoupload">投稿</Link>
									</Box>
									<Box>
										<Link href="/myPage">マイページ</Link>
									</Box>
									<Box>
										<Link href="/settings">設定</Link>
									</Box>
									<Box>
										<Text onClick={onLogout}>ログアウト</Text>
									</Box>
								</>
							) : (
								<>
									<Box>
										<Link href="/auth/login">ログイン</Link>
									</Box>
									<Box>
										<Link href="/auth//register">新規登録</Link>
									</Box>
								</>
							)}
						</Stack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default MenuDrawer;
