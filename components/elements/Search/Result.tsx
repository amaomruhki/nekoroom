import {
	Box,
	Grid,
	GridItem,
	HStack,
	Image,
	Stack,
	Text,
} from "@chakra-ui/react";

//商品名を45文字目以降「…」にする
const convertSubstring = (string) => {
	const name = string;
	if (name.length > 45) {
		const splitName = name.substring(0, 45);
		return splitName + "...";
	} else {
		return name;
	}
};

const Result = ({ result }) => {
	return (
		<>
			<Grid
				templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
				gap={1}
			>
				{result?.Items?.length >= 1
					? result.Items.map((item, index) => (
							<GridItem key={index}>
								<Box bg="white" boxShadow="md" rounded="md" p={4} m="8px">
									<Stack align="center">
										<Image
											alt={item.Item.mediumImageUrls[0].imageUrl}
											src={item.Item.mediumImageUrls[0].imageUrl}
											boxSize="220px"
											objectFit="cover"
										/>
									</Stack>
									<Text fontSize="md" as="b">
										{item.Item.itemPrice.toLocaleString()}円
									</Text>
									<Text>{convertSubstring(item.Item.itemName)}</Text>
								</Box>
							</GridItem>
					  ))
					: null}
			</Grid>
		</>
	);
};

export default Result;
