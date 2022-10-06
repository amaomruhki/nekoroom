import React from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Footer from "../components/layouts/Footer/Footer";
import Header from "../components/layouts/Header/Header";
import {
	Box,
	Container,
	Heading,
	HStack,
	VStack,
	Text,
	Textarea,
	Select,
	Button,
	Stack,
	Icon,
	Flex,
	Spacer,
	Center,
} from "@chakra-ui/react";
import PrimaryButton from "../components/elements/Button/PrimaryButton";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { PadIcon } from "../components/elements/Icon/Icon";

const postdetail = () => {
	return (
		<>
			<Header />
			<Container pt={8} pb={8} mt="50px">
				<Box maxW="420px" bg="white" p={4} rounded="sm" boxShadow="md">
					<Image src="/testphoto.jpg" width={400} height={400} alt="" />
					<Flex alignItems="center" gap="2">
						<HStack p={2}>
							<Avatar
								size="md"
								name="Kent Dodds"
								src="https://bit.ly/kent-c-dodds"
							/>
							<VStack align="left">
								<Text fontSize="md" as="b">
									Kent Dodds
								</Text>
								<Text fontSize="sm">2022/10/03 19:00</Text>
							</VStack>
						</HStack>
						<Spacer />
						<Icon
							as={PadIcon}
							color="#d6d6d6"
							w={8}
							h={8}
							_hover={{ color: "#E4626E" }}
						/>
					</Flex>
				</Box>
				<VStack
					w="100%"
					maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "30vw" }}
					pb={100}
					mt={4}
					align="left"
				>
					<Heading as="h3" size="md">
						カテゴリ
					</Heading>
					<HStack p={1}>
						<Button variant="outline" bg="#ffffff" color="gray.900">
							キャットタワー
						</Button>
						<Button variant="outline" bg="#ffffff" color="gray.900">
							部屋全体
						</Button>
					</HStack>
					<Heading as="h3" size="md">
						アイテム
					</Heading>
					<Box
						bg="white"
						boxShadow="sm"
						width="120px"
						minW="120px"
						rounded="md"
						p="8px"
						m="8px"
					>
						<Stack align="center">
							<Image
								alt="testphoto"
								src="/testphoto.jpg"
								width="100px"
								height="100px"
							/>
						</Stack>
						<Text fontWeight="bold" fontSize="xs">
							アイテム情報がここに入りますアイテム情報がここに入りますアイテム情報がここに入ります
						</Text>
					</Box>
					<Heading as="h3" size="md">
						コメント
					</Heading>
					<Textarea
						bg="white"
						placeholder="コメントを入力してください"
					></Textarea>
					<Center>
						<PrimaryButton
							bg="#ffffff"
							color="gray.900"
							borderColor="gray.900"
							border="1px"
						>
							コメントする
						</PrimaryButton>
					</Center>
					<VStack spacing={4} pt={6}>
						<Box bg="white" p={4} rounded="md">
							<HStack p={2}>
								<Avatar
									size="sm"
									name="Kent Dodds"
									src="https://bit.ly/kent-c-dodds"
								/>
								<HStack alignItems="center">
									<Text fontSize="md" as="b">
										Kent Dodds
									</Text>
									<Text fontSize="sm">2022/10/03 19:00</Text>
								</HStack>
							</HStack>
							<Text>
								ここにコメントが入りますここにコメントが入りますここにコメントが入ります
							</Text>
						</Box>
						<Box bg="white" p={4} rounded="md">
							<HStack p={2}>
								<Avatar
									size="sm"
									name="Kent Dodds"
									src="https://bit.ly/kent-c-dodds"
								/>
								<HStack alignItems="center">
									<Text fontSize="md" as="b">
										Kent Dodds
									</Text>
									<Text fontSize="sm">2022/10/03 19:00</Text>
								</HStack>
							</HStack>
							<Text>
								ここにコメントが入りますここにコメントが入りますここにコメントが入ります
							</Text>
						</Box>
						<Box bg="white" p={4} rounded="md">
							<HStack p={2}>
								<Avatar
									size="sm"
									name="Kent Dodds"
									src="https://bit.ly/kent-c-dodds"
								/>
								<HStack alignItems="center">
									<Text fontSize="md" as="b">
										Kent Dodds
									</Text>
									<Text fontSize="sm">2022/10/03 19:00</Text>
								</HStack>
							</HStack>
							<Text>
								ここにコメントが入りますここにコメントが入りますここにコメントが入ります
							</Text>
						</Box>
					</VStack>
				</VStack>
			</Container>
			<Footer />
		</>
	);
};

export default postdetail;
