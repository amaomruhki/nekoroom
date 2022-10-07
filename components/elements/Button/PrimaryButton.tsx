import React from "react";
import type { ReactNode } from "react";
import { Button } from "@chakra-ui/react";

type Props = {
	children: ReactNode;
	bg: "#E4626E" | "#ffffff" | "#D6D6D6";
	color: "#ffffff" | "gray.900";
	variant?: "solid" | "outline";
	borderColor?: "gray.900";
	border?: "1px";
	// onClick: () => void;
};

const PrimaryButton = ({
	children,
	bg,
	color,
	variant,
	border,
	borderColor,
}: Props) => {
	return (
		<>
			<Button
				// onClick={onClick}
				width="200px"
				height="45px"
				bg={bg}
				color={color}
				variant={variant}
				border={border}
				borderColor={borderColor}
				_hover={{ opacity: 0.8 }}
			>
				{children}
			</Button>
		</>
	);
};

export default PrimaryButton;
