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
	VStack,
} from "@chakra-ui/react";
import { PadIcon } from "../../elements/Icon/Icon";
import type { ReactNode } from "react";
import Link from "next/link";
import { convertSubstring } from "../../../utils/DataFormat";

// type Props = {
// 	children?: ReactNode;
// 	postId: string;
// 	userId: string;
// 	username: string;
// 	userImg: string;
// 	image: string;
// 	caption: string;
// 	handleLikeCount: () => void;
// 	likeCount: number;
// };

const Post = ({
	handleLikeCount,
	postId,
	userId,
	username,
	userImg,
	image,
	caption,
	likeCount,
}) => {
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
								{convertSubstring(username, 10)}
							</Text>
						</HStack>

						<Spacer />
						<HStack spacing={0}>
							<IconButton
								p={0}
								aria-label="like"
								variant="ghost"
								icon={<PadIcon />}
								color="#d6d6d6"
								fontSize="20px"
								_hover={{ color: "#E4626E" }}
								onClick={handleLikeCount}
								sx={{ margin: "-4px" }}
							/>
							<Text as="b" fontSize="xs" color="#d6d6d6">
								{likeCount}
							</Text>
						</HStack>
					</HStack>
					<Text fontSize="sm">{convertSubstring(caption, 17)}</Text>
				</Box>
			</GridItem>
		</Link>
	);
};

export default Post;
