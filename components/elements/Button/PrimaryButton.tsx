import React from "react";
import type { ReactNode } from "react";
import { Button } from "@chakra-ui/react";

type Props = {
	children: ReactNode;
	bg: "#E4626E" | "#ffffff" | "#D6D6D6";
	color: "#ffffff" | "gray.900";
	variant: "solid" | "outline";
	// onClick: () => void;
};

const PrimaryButton = (props: Props) => {
	const { children, bg, color, variant } = props;
	return (
		<>
			<Button
				// onClick={onClick}
				bg={bg}
				color={color}
				variant={variant}
				_hover={{ opacity: 0.8 }}
			>
				{children}
			</Button>
		</>
	);
};

export default PrimaryButton;
