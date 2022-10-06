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

const MenuDrawer = (props: Props) => {
	const { isOpen, onClose } = props;
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
							<Box>
								<Link href="/">トップ</Link>
							</Box>
							<Box>
								<Link href="/login">ログイン</Link>
							</Box>
							<Box>
								<Link href="/register">新規登録</Link>
							</Box>
							<Box>
								<Link href="/post">投稿</Link>
							</Box>
							<Box>
								<Link href="/postdetail">投稿詳細</Link>
							</Box>
						</Stack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default MenuDrawer;
