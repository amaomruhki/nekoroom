import React from "react";
import { Center, Container, Flex, Icon } from "@chakra-ui/react";
import { HiHome } from "react-icons/Hi";
import { FaSearch, FaPlusCircle, FaUser } from "react-icons/Fa";
import { PadIcon } from "../../elements/Icon/Icon";
import Link from "next/link";

const Footer = () => {
	return (
		<>
			<Container
				display={{ base: "block", md: "none" }}
				bg="white"
				borderTop="1px"
				borderColor="gray.200"
				maxW="100%"
				sx={{ position: "fixed", bottom: "0px", height: "55px" }}
			>
				<Flex
					as="nav"
					justify="space-between"
					align="center"
					height="100%"
					px={4}
				>
					<Link href="/">
						<Icon
							as={HiHome}
							color="#d6d6d6"
							w={6}
							h={6}
							_hover={{ color: "#E4626E" }}
						/>
					</Link>
					<Icon
						as={FaSearch}
						color="#d6d6d6"
						w={6}
						h={6}
						_hover={{ color: "#E4626E" }}
					/>
					<Link href="/photoupload">
						<Icon
							as={FaPlusCircle}
							color="#d6d6d6"
							w={6}
							h={6}
							_hover={{ color: "#E4626E" }}
						/>
					</Link>
					<Icon
						as={PadIcon}
						color="#d6d6d6"
						w={6}
						h={6}
						_hover={{ color: "#E4626E" }}
					/>
					<Icon
						as={FaUser}
						color="#d6d6d6"
						w={6}
						h={6}
						_hover={{ color: "#E4626E" }}
					/>
				</Flex>
			</Container>
		</>
	);
};

export default Footer;
