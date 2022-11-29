import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
} from "@chakra-ui/react";

type Props = {
	title: string;
	description: string;
	status: "error" | "success";
};

export const AlertMessage = ({ title, description, status }: Props) => {
	return (
		<Alert
			status={status}
			mt={2}
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			textAlign="center"
		>
			<AlertIcon />
			<AlertTitle mt={4} mb={1} fontSize="md">
				{title}
			</AlertTitle>
			<AlertDescription maxWidth="sm">{description}</AlertDescription>
		</Alert>
	);
};
