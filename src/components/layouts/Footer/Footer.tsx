import NextLink from "next/link";
import { Container, Flex, Icon, Link, Avatar } from "@chakra-ui/react";
import { HiHome } from "react-icons/Hi";
import { FaPlusCircle, FaUser } from "react-icons/Fa";
import { PadIcon } from "../../elements/Icon/Icon";
import { useRecoilState } from "recoil";
import { userState } from "../../../Atoms/userAtom";

const Footer = () => {
	const [currentUser] = useRecoilState(userState);
	const userId = currentUser?.uid;
	const username = currentUser?.username;
	const userImg = currentUser?.userImg;

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
					<NextLink href="/" passHref>
						<Link>
							<Icon
								as={HiHome}
								color="#d6d6d6"
								w={8}
								h={8}
								sx={{ margin: -2 }}
								_hover={{ color: "#E4626E" }}
							/>
						</Link>
					</NextLink>

					{currentUser ? (
						<>
							<NextLink href="/photoUpload" passHref>
								<Link>
									<Icon
										as={FaPlusCircle}
										color="#d6d6d6"
										w={8}
										h={8}
										sx={{ margin: -2 }}
										_hover={{ color: "#E4626E" }}
									/>
								</Link>
							</NextLink>
							<NextLink
								href={{
									pathname: "/[userId]/myLike",
									query: { userId: userId },
								}}
								passHref
							>
								<Link>
									<Icon
										as={PadIcon}
										color="#d6d6d6"
										w={8}
										h={8}
										_hover={{ color: "#E4626E" }}
									/>
								</Link>
							</NextLink>
							<NextLink
								href={{
									pathname: "/[userId]/myPage",
									query: { userId: userId },
								}}
								passHref
							>
								<Link>
									<Avatar size="sm" name={username} src={userImg} />
								</Link>
							</NextLink>
						</>
					) : (
						<>
							<NextLink href="/auth/login" passHref>
								<Link>
									<Icon
										as={FaPlusCircle}
										color="#d6d6d6"
										w={8}
										h={8}
										_hover={{ color: "#E4626E" }}
									/>
								</Link>
							</NextLink>
							<NextLink href="/auth/login" passHref>
								<Link>
									<Icon
										as={PadIcon}
										color="#d6d6d6"
										w={8}
										h={8}
										_hover={{ color: "#E4626E" }}
									/>
								</Link>
							</NextLink>
							<NextLink href="/auth/login" passHref>
								<Link href="/auth/login">
									<Icon
										as={FaUser}
										color="#d6d6d6"
										w={8}
										h={8}
										_hover={{ color: "#E4626E" }}
									/>
								</Link>
							</NextLink>
						</>
					)}
				</Flex>
			</Container>
		</>
	);
};

export default Footer;
