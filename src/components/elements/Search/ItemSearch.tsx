import {
	Input,
	InputGroup,
	InputLeftElement,
	FormControl,
	Button,
	HStack,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

const ItemSearch = ({ value, handleFreeWord, handleSubmit, placeholder }) => {
	return (
		<FormControl>
			<HStack>
				<InputGroup>
					<InputLeftElement
						pointerEvents="none"
						// eslint-disable-next-line react/no-children-prop
						children={<Search2Icon color="gray.300" />}
					/>
					<Input
						variant="outline"
						placeholder={placeholder}
						value={value.freeWord}
						onChange={handleFreeWord}
					/>
				</InputGroup>
				<Button
					borderColor="gray.300"
					border="1px"
					bg="#ffffff"
					color="gray.900"
					size="md"
					onClick={() => handleSubmit(value)}
					disabled={!value.freeWord}
				>
					検索
				</Button>
			</HStack>
		</FormControl>
	);
};

export default ItemSearch;
