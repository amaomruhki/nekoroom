import NextLink from "next/link";
import {
	GridItem,
	Stack,
	Text,
	Box,
	HStack,
	Avatar,
	Spacer,
	Image,
	IconButton,
	Icon,
} from "@chakra-ui/react";
import { PadIcon } from "../../elements/Icon/Icon";
import type { ReactNode } from "react";
import Link from "next/link";
import { convertSubstring } from "../../../utils/DataFormat";

type Props = {
	children?: ReactNode;
	postId: string;
	userId: string;
	username: string;
	userImg: string;
	image: string;
	caption: string;
	likeCount: number;
};

const Post = ({
	postId,
	userId,
	username,
	userImg,
	image,
	caption,
	likeCount,
}: Props) => {
	return (
		<NextLink
			href={{
				pathname: "/[userId]/[postId]/postdetail",
				query: { userId: userId, postId: postId },
			}}
			passHref
		>
			<GridItem key={postId} cursor="pointer">
				<Box bg="white" boxShadow="md" rounded="md" p={4} m="8px">
					<Stack align="center">
						<Image
							alt={`${username}'s photo`}
							src={image}
							boxSize="220px"
							objectFit="cover"
						/>
					</Stack>
					<HStack p={2}>
						{userImg ? (
							<Avatar size="sm" name={username} src={userImg} />
						) : (
							<Avatar size="sm" name={username} />
						)}
						<HStack alignItems="center">
							<Text fontSize="sm" as="b">
								{convertSubstring(username, 10)}
							</Text>
						</HStack>

						<Spacer />
						<HStack spacing={2}>
							<Icon as={PadIcon} color="#d6d6d6" w={6} h={6} />
							<Text as="b" fontSize="xs" color="#d6d6d6">
								{likeCount}
							</Text>
						</HStack>
					</HStack>
					<Text fontSize="sm">{convertSubstring(caption, 17)}</Text>
				</Box>
			</GridItem>
		</NextLink>
	);
};

export default Post;
