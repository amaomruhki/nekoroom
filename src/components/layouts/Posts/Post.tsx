import NextLink from "next/link";
import {
	GridItem,
	Text,
	Box,
	HStack,
	Avatar,
	Spacer,
	Image,
	Icon,
	AspectRatio,
} from "@chakra-ui/react";
import { PadIcon } from "../../elements/Icon/Icon";
import type { ReactNode } from "react";
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
				pathname: "/[userId]/[postId]/postDetail",
				query: { userId: userId, postId: postId },
			}}
		>
			<GridItem key={postId} cursor="pointer">
				<Box bg="white" boxShadow="md" rounded="md" p={4}>
					<AspectRatio ratio={1 / 1}>
						<Image alt={`${username}'s photo`} src={image} objectFit="cover" />
					</AspectRatio>
					<HStack p={2}>
						<Avatar size="sm" name={username} src={userImg} />

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
					<Text fontSize="sm">{convertSubstring(caption, 46)}</Text>
				</Box>
			</GridItem>
		</NextLink>
	);
};

export default Post;
