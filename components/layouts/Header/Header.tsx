import React from "react";
import Image from "next/image";
import MenuDrawer from "../../elements/MenuDrawer";
import MenuIconButton from "../../elements/Button/MenuIconButton";
import { Container, Flex, useDisclosure } from "@chakra-ui/react";
// import SearchInput from "../../elements/SearchInput";

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
				sx={{ position: "fixed" }}
			>
				<Container maxW="810px">
					<Flex as="nav" justify="space-between" align="center">
						<Image src="/logo.svg" alt="logo" width="158px" height="34px" />
						<MenuIconButton onOpen={onOpen} />
						<MenuDrawer onClose={onClose} isOpen={isOpen} />
					</Flex>
					{/* <Flex my={2}>
						<SearchInput placeholder={"写真やアイテムを探す"} />
					</Flex> */}
				</Container>
			</Container>
		</>
	);
};

export default Header;
