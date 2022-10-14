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
	Spacer,
	Center,
} from "@chakra-ui/react";
import PrimaryButton from "../components/elements/Button/PrimaryButton";

const PhotoUpload = () => {
	const category = [
		{ text: "部屋全体", value: "1" },
		{ text: "猫専用スペース", value: "2" },
		{ text: "キャットタワー", value: "3" },
		{ text: "猫トイレ", value: "4" },
		{ text: "猫食器", value: "5" },
		{ text: "つめとぎ", value: "6" },
		{ text: "猫ベッド", value: "7" },
		{ text: "猫おもちゃ", value: "8" },
		{ text: "ごはん台", value: "9" },
		{ text: "猫グッズ収納", value: "10" },
		{ text: "ネコ飼いライフハック", value: "11" },
		{ text: "お掃除グッズ", value: "12" },
	];

	return (
		<>
			<Header />
			<Container maxW="800px" pt={8} pb={8} mt={20} mb={20}>
				<VStack align="left" spacing={4}>
					<Heading as="h2">ネコルームを投稿する</Heading>
					<Spacer />
					<HStack>
						<Heading as="h3" size="md">
							写真を追加する
						</Heading>
						<Text color="#E4626E" as="b">
							※必須
						</Text>
					</HStack>
					<Text>
						画像形式:JPEG/PNG
						<br />
						容量:10MB以内
						<br />
						推奨サイズ:？？
					</Text>
					<Box>
						<Image src="/testphoto.jpg" width={400} height={400} alt="" />
					</Box>
					<Heading as="h3" size="md">
						テキストを追加する
					</Heading>
					<Textarea
						bg="white"
						placeholder="テキストを入力してください"
					></Textarea>
					<HStack>
						<Heading as="h3" size="md">
							カテゴリを追加する
						</Heading>
						<Text color="#E4626E" as="b">
							※必須
						</Text>
					</HStack>
					<Select bg="white" placeholder="カテゴリを選択してください">
						{category.map(({ text, value }) => (
							<option key={value} value={value}>
								{text}
							</option>
						))}
					</Select>
					<Heading as="h3" size="md">
						アイテムを追加する
					</Heading>

					<PrimaryButton variant="outline" bg="#ffffff" color="gray.900">
						アイテムを選択
					</PrimaryButton>
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
					<Spacer />
					<Center>
						<PrimaryButton variant="solid" bg="#E4626E" color="#ffffff">
							ネコルームを投稿する
						</PrimaryButton>
					</Center>
				</VStack>
			</Container>
			<Footer />
		</>
	);
};

export default PhotoUpload;
