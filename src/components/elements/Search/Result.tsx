import { Button, Grid, GridItem, Image, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { convertSubstring } from "../../../utils/DataFormat";
import { Dispatch, SetStateAction } from "react";

type Props = {
	result: any;
	setItemResult: Dispatch<SetStateAction<{}>>;
	onClose: () => void;
	setValue: Dispatch<
		SetStateAction<{
			freeWord: string;
		}>
	>;
};

// 検索結果表示
export const Result = ({ result, setItemResult, onClose, setValue }: Props) => {
	return (
		<>
			<Grid
				templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
				gap={1}
			>
				{result?.Items?.length >= 1
					? result.Items.map((item: any, index: number) => (
							<GridItem key={index}>
								<Stack bg="white" boxShadow="md" rounded="md" p={2} m="4px">
									<Stack align="center">
										<Image
											alt={item.Item.itemUrl}
											src={item.Item.mediumImageUrls[0].imageUrl}
											boxSize="220px"
											objectFit="scale-down"
										/>
									</Stack>
									<Text fontSize="sm" color="gray.500">
										{convertSubstring(item.Item.shopName, 30)}
									</Text>
									<Text fontSize="sm" as="b">
										￥{item.Item.itemPrice.toLocaleString()}
									</Text>
									<Text fontSize="sm">
										{convertSubstring(item.Item.itemName, 30)}
									</Text>
									<Button
										borderColor="#E4626E"
										border="1px"
										bg="#ffffff"
										color="#E4626E"
										size="sm"
										_hover={{ bg: "#E4626E", color: "#ffffff" }}
										onClick={() => {
											const data = {
												imageUrl: item.Item.mediumImageUrls[0].imageUrl,
												price: item.Item.itemPrice.toLocaleString(),
												shopName: item.Item.shopName,
												itemName: item.Item.itemName,
												itemUrl: item.Item.itemUrl,
											};
											setItemResult(data);
											setValue({ freeWord: "" });
											onClose();
										}}
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
