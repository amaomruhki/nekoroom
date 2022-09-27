import React from "react";
import { useWindowSize } from "react-use";
import {
	Drawer,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
} from "@chakra-ui/react";

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
					<DrawerCloseButton />
					<DrawerHeader>Menu</DrawerHeader>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default MenuDrawer;
