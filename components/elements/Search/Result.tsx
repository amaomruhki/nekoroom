import {
	Box,
	Button,
	Grid,
	GridItem,
	Image,
	Stack,
	Text,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

//商品名を45文字目以降「…」にする
const convertSubstring = (string) => {
	const name = string;
	if (name.length > 45) {
		const splitName = name.substring(0, 30);
		return splitName + "...";
	} else {
		return name;
	}
};

const Result = ({ result }) => {
	console.log({ result });

	return (
		<>
			<Grid
				templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
				gap={1}
			>
				{result?.Items?.length >= 1
					? result.Items.map((item, index) => (
							<GridItem key={index}>
								<Stack bg="white" boxShadow="md" rounded="md" p={2} m="4px">
									<Stack align="center">
										<Image
											alt={item.Item.mediumImageUrls[0].imageUrl}
											src={item.Item.mediumImageUrls[0].imageUrl}
											boxSize="220px"
											objectFit="scale-down"
										/>
									</Stack>
									<Text fontSize="sm" color="gray.500">
										{convertSubstring(item.Item.shopName)}
									</Text>
									<Text fontSize="sm" as="b">
										￥{item.Item.itemPrice.toLocaleString()}
									</Text>
									<Text fontSize="sm">
										{convertSubstring(item.Item.itemName)}
									</Text>
									<Button
										borderColor="#E4626E"
										border="1px"
										bg="#ffffff"
										color="#E4626E"
										size="sm"
										_hover={{ bg: "#E4626E", color: "#ffffff" }}
										onClick={() => handleSubmitItem(value)}
										leftIcon={<AddIcon />}
									>
										アイテムを追加
									</Button>
								</Stack>
							</GridItem>
					  ))
					: null}
			</Grid>
		</>
	);
};

export default Result;
