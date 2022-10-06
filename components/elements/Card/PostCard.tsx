import React from "react";
import {
	Flex,
	Box,
	Avatar,
	Text,
	WrapItem,
	Wrap,
	Image,
	Grid,
} from "@chakra-ui/react";
// import Image from "next/image";

const data = {
	imageURL:
		"https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=4600&q=80",
	name: "Love9646",
};

const PostCard = () => {
	return (
		<Box bg="white" boxShadow="sm" width="200px" minW="200px" rounded="md">
			<Box>
				<Image alt="testphoto" src="/testphoto.jpg" roundedTop="md" />
			</Box>
			<Box px={6} pb={6}>
				<Text fontWeight="bold" fontSize="sm" height="42px">
					ここにタイトル
				</Text>
			</Box>
		</Box>
	);
};

export default PostCard;
