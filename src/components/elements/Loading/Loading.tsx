import { Flex, VStack, Spinner, Text } from "@chakra-ui/react";

export const Loading = () => {
	return (
		<Flex align="center" justify="center" height="100vh">
			<VStack>
				<Spinner color="#E4626E" />
				<Text color="#E4626E">Loading...</Text>
			</VStack>
		</Flex>
	);
};
