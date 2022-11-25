import NextLink from "next/link";
import {
	Container,
	Flex,
	Icon,
	Link,
	Avatar,
	Text,
	HStack,
	VStack,
	Center,
} from "@chakra-ui/react";
import { HiHome } from "react-icons/hi";
import { FaPlusCircle, FaUser } from "react-icons/fa";
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
				p={2}
				sx={{ position: "fixed", bottom: "0px", height: "58px" }}
			>
				<Flex as="nav" justify="space-between" align="top" height="100%" px={6}>
					<VStack justify="center" align="center">
						<NextLink href="/" passHref>
							<Link>
								<Center>
									<Icon
										as={HiHome}
										color="#3d3d3d"
										w={8}
										h={8}
										_hover={{ color: "#E4626E" }}
										sx={{ marginBottom: "-2px" }}
									/>
								</Center>
								<Center>
									<Text fontSize="xs" align="center">
										ホーム
									</Text>
								</Center>
							</Link>
						</NextLink>
					</VStack>

					{currentUser ? (
						<>
							<VStack justify="center" align="center">
								<NextLink href="/photoUpload" passHref>
									<Link>
										<Center>
											<Icon
												as={FaPlusCircle}
												color="#3d3d3d"
												w={8}
												h={8}
												_hover={{ color: "#E4626E" }}
												sx={{ marginBottom: "-1px" }}
											/>
										</Center>
										<Center>
											<Text fontSize="xs" align="center">
												投稿
											</Text>
										</Center>
									</Link>
								</NextLink>
							</VStack>

							<VStack justify="center" align="center">
								<NextLink
									href={{
										pathname: "/[userId]/myLike",
										query: { userId: userId },
									}}
									passHref
								>
									<Link>
										<Center>
											<Icon
												as={PadIcon}
												color="#3d3d3d"
												w={8}
												h={8}
												_hover={{ color: "#E4626E" }}
											/>
										</Center>
										<Center>
											<Text fontSize="xs" align="center">
												いいにゃ
											</Text>
										</Center>
									</Link>
								</NextLink>
							</VStack>

							<VStack justify="center" align="center">
								<NextLink
									href={{
										pathname: "/[userId]/myPage",
										query: { userId: userId },
									}}
									passHref
								>
									<Link>
										<Center>
											<Avatar size="sm" name={username} src={userImg} />
										</Center>
										<Center>
											<Text fontSize="xs" align="center">
												マイページ
											</Text>
										</Center>
									</Link>
								</NextLink>
							</VStack>
						</>
					) : (
						<>
							<VStack justify="center" align="center">
								<NextLink href="/auth/login" passHref>
									<Link>
										<Center>
											<Icon
												as={FaPlusCircle}
												color="#3d3d3d"
												w={8}
												h={8}
												_hover={{ color: "#E4626E" }}
												sx={{ marginBottom: "-1px" }}
											/>
										</Center>
										<Center>
											<Text fontSize="xs" align="center">
												投稿
											</Text>
										</Center>
									</Link>
								</NextLink>
							</VStack>
							<VStack justify="center" align="center">
								<NextLink href="/auth/login" passHref>
									<Link>
										<Center>
											<Icon
												as={PadIcon}
												color="#3d3d3d"
												w={8}
												h={8}
												_hover={{ color: "#E4626E" }}
											/>
										</Center>
										<Center>
											<Text fontSize="xs" align="center">
												いいにゃ
											</Text>
										</Center>
									</Link>
								</NextLink>
							</VStack>
							<VStack justify="center" align="center">
								<NextLink href="/auth/login" passHref>
									<Link href="/auth/login">
										<Center>
											<Icon
												as={FaUser}
												color="#3d3d3d"
												w={8}
												h={8}
												_hover={{ color: "#E4626E" }}
											/>
										</Center>
										<Center>
											<Text fontSize="xs" align="center">
												マイページ
											</Text>
										</Center>
									</Link>
								</NextLink>
							</VStack>
						</>
					)}
				</Flex>
			</Container>
		</>
	);
};

export default Footer;
