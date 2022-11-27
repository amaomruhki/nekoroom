import NextLink from "next/link";
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Link,
} from "@chakra-ui/react";
import { ItemSearch } from "./Search/ItemSearch";
import { Loading } from "./Loading/Loading";
import { Result } from "./Search/Result";
import { Dispatch, SetStateAction } from "react";

type Props = {
	onCloseDialog: () => void;
	handleFreeWord: (event: any) => void;
	handleSubmit: (value: any) => void;
	value: { freeWord: string };
	fetching: boolean;
	setItemResult: Dispatch<SetStateAction<{}>>;
	setValue: Dispatch<
		SetStateAction<{
			freeWord: string;
		}>
	>;
	selectedButton: string;
	result: {};
};

export const ItemAddModal = ({
	onCloseDialog,
	fetching,
	handleSubmit,
	result,
	setItemResult,
	value,
	setValue,
	selectedButton,
	handleFreeWord,
}: Props) => {
	return (
		<Modal isOpen={"item" === selectedButton} onClose={onCloseDialog}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader mt={6}>
					<ItemSearch
						value={value}
						handleFreeWord={handleFreeWord}
						handleSubmit={handleSubmit}
						placeholder="アイテム名を入力"
					/>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{fetching ? (
						<Loading />
					) : (
						//fetch完了したらレスポンスデータを表示
						<Result
							result={result}
							setItemResult={setItemResult}
							onClose={onCloseDialog}
							setValue={setValue}
						/>
					)}
				</ModalBody>
				<ModalFooter>
					<NextLink href="https://developers.rakuten.com/" passHref>
						<Link target="_blank">Supported by Rakuten Developers</Link>
					</NextLink>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
