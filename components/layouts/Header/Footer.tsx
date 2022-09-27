import React from "react";
import MenuDrawer from "../../elements/MenuDrawer";
import MenuIconButton from "../../elements/Button/MenuIconButton";
import { Container, Flex, Text } from "@chakra-ui/react";
import SearchInput from "../../elements/SearchInput";

const Footer = () => {
	return (
		<>
			<Container
				display={{ base: "block", md: "none" }}
				bg="white"
				borderTop="1px"
				borderColor="gray.200"
				py={2}
				maxW="100%"
				sx={{ position: "fixed", bottom: "0px", height: "55px" }}
			>
				<Text>SPだけフッターメニュー</Text>
			</Container>
		</>
	);
};

export default Footer;
