import {
	GridItem,
	Stack,
	Text,
	Box,
	HStack,
	Avatar,
	Spacer,
	Icon,
	Image,
} from "@chakra-ui/react";
import { PadIcon } from "../../elements/Icon/Icon";
import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
	children?: ReactNode;
	postId: string;
	userId: string;
	username: string;
	userImg: string;
	image: string;
	caption: string;
};

const Post = ({ userId, postId, username, userImg, image, caption }: Props) => {
	return (
		<Link href={`${userId}/${postId}/postdetail`}>
			<GridItem key={postId}>
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
								{username}
							</Text>
						</HStack>

						<Spacer />
						<Icon
							as={PadIcon}
							color="#d6d6d6"
							w={6}
							h={6}
							_hover={{ color: "#E4626E" }}
						/>
					</HStack>
					<Text fontSize="sm">{caption}</Text>
				</Box>
			</GridItem>
		</Link>
	);
};

export default Post;
