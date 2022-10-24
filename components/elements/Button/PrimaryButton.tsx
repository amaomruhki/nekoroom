import React from "react";
import type { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

type Props = {
	children: ReactNode;
	bg: "#E4626E" | "#ffffff" | "#D6D6D6";
	color: "#ffffff" | "gray.900" | "#E4626E";
	borderColor?: "gray.300" | "#E4626E";
	border?: "1px";
	onClick?: () => void;
	disabled?: boolean;
};

const PrimaryButton = ({
	children,
	bg,
	color,
	border,
	borderColor,
	onClick,
	disabled,
}: Props) => {
	return (
		<>
			<Box
				as="button"
				onClick={onClick}
				width="200px"
				height="45px"
				bg={bg}
				borderRadius="md"
				fontWeight="semibold"
				color={color}
				border={border}
				borderColor={borderColor}
				_hover={{ opacity: 0.8 }}
				_disabled={{ bg: "#ffffff", color: "gray.200", opacity: 1 }}
				disabled={disabled}
			>
				{children}
			</Box>
		</>
	);
};

export default PrimaryButton;
