import React from "react";
import Image from "next/image";
import MenuDrawer from "../../elements/Drawer/MenuDrawer";
import MenuIconButton from "../../elements/Button/MenuIconButton";
import { Container, Flex, useDisclosure } from "@chakra-ui/react";
import Link from "next/link";

const Header = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<Container
				bg="white"
				borderBottom="1px"
				borderColor="gray.200"
				py={2}
				maxW="100%"
				sx={{ position: "fixed", zIndex: "99", top: 0 }}
			>
				<Container maxW="810px">
					<Flex as="nav" justify="space-between" align="center">
						<Link href="/">
							<Image src="/logo.svg" alt="logo" width="158px" height="34px" />
						</Link>
						<MenuIconButton onOpen={onOpen} />
						<MenuDrawer onClose={onClose} isOpen={isOpen} />
					</Flex>
				</Container>
			</Container>
		</>
	);
};

export default Header;
