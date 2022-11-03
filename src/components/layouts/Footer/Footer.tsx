import React from "react";
import {
	Text,
	Box,
	Container,
	Flex,
	Icon,
	Link,
	HStack,
	VStack,
	Avatar,
} from "@chakra-ui/react";
import { HiHome } from "react-icons/Hi";
import { FaSearch, FaPlusCircle, FaUser } from "react-icons/Fa";
import { PadIcon } from "../../elements/Icon/Icon";
import { useRecoilState } from "recoil";
import { userState } from "../../../Atoms/userAtom";
import { Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Footer = () => {
	const [currentUser] = useRecoilState(userState);
	const router = useRouter();
	const userId = currentUser?.uid;
	const username = currentUser?.username;
	const userImg = currentUser?.userImg;
	console.log(currentUser);

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
					px={6}
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
					{currentUser ? (
						<Link href="/photoUpload">
							<Icon
								as={FaPlusCircle}
								color="#d6d6d6"
								w={6}
								h={6}
								_hover={{ color: "#E4626E" }}
							/>
						</Link>
					) : (
						<Link href="/auth/login">
							<Icon
								as={FaPlusCircle}
								color="#d6d6d6"
								w={6}
								h={6}
								_hover={{ color: "#E4626E" }}
							/>
						</Link>
					)}
					<Icon
						as={PadIcon}
						color="#d6d6d6"
						w={6}
						h={6}
						_hover={{ color: "#E4626E" }}
					/>
					{currentUser ? (
						userImg ? (
							<Link href={`${userId}/myPage`}>
								<Avatar size="sm" name={username} src={userImg} />
							</Link>
						) : (
							<Link href={`${userId}/myPage`}>
								<Avatar size="sm" name={username} />
							</Link>
						)
					) : (
						<Link href="/auth/login">
							<Icon
								as={FaUser}
								color="#d6d6d6"
								w={6}
								h={6}
								_hover={{ color: "#E4626E" }}
							/>
						</Link>
					)}
				</Flex>
			</Container>
		</>
	);
};

export default Footer;
