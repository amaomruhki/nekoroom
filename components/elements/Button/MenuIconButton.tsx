import React from "react";
import { IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

type Props = {
	onOpen: () => void;
};

const MenuIconButton = ({ onOpen }: Props) => {
	return (
		<>
			<IconButton
				color="#d6d6d6"
				aria-label="メニューボタン"
				icon={<HamburgerIcon w={6} h={6} />}
				onClick={onOpen}
				variant="unstyled"
				cursor="pointer"
			/>
		</>
	);
};

export default MenuIconButton;
