import {
	Grid,
	GridItem,
	Stack,
	Text,
	Box,
	HStack,
	Avatar,
	Spacer,
	Icon,
} from "@chakra-ui/react";
import Image from "next/image";
import { PadIcon } from "./Icon/Icon";

const images = [
	"/testphoto.jpg",
	"/testphoto.jpg",
	"/testphoto.jpg",
	"/testphoto.jpg",
	"/testphoto.jpg",
	"/testphoto.jpg",
	"/testphoto.jpg",
	"/testphoto.jpg",
	"/testphoto.jpg",
	"/testphoto.jpg",
	"/testphoto.jpg",
	"/testphoto.jpg",
	"/testphoto.jpg",
	"/testphoto.jpg",
];

const ImageDisplay = () => {
	return (
		<Grid
			templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
			gap={1}
		>
			{images.map((image) => {
				return (
					<GridItem key={image}>
						<Box bg="white" boxShadow="md" rounded="md" p={4} m="8px">
							<Stack align="center">
								<Image
									alt="testphoto"
									src={image}
									// layout="responsive"
									width={400}
									height={400}
									priority
								/>
							</Stack>
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
								</HStack>

								<Spacer />
								<Icon
									as={PadIcon}
									color="#d6d6d6"
									w={8}
									h={8}
									_hover={{ color: "#E4626E" }}
								/>
							</HStack>
							<Text>
								ここにコメントが入りますここにコメントが入りますここにコメントが入ります
							</Text>
						</Box>
					</GridItem>
				);
			})}
		</Grid>
	);
};

export default ImageDisplay;
