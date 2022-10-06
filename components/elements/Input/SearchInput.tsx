import React from "react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

type Props = {
	placeholder: string;
};

const SearchInput = (props: Props) => {
	const { placeholder } = props;
	return (
		<InputGroup>
			<InputLeftElement
				pointerEvents="none"
				// eslint-disable-next-line react/no-children-prop
				children={<Search2Icon color="gray.300" />}
			/>
			<Input variant="outline" placeholder={placeholder} />
		</InputGroup>
	);
};

export default SearchInput;
