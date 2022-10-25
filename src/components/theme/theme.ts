import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
	styles: {
		global: {
			body: {
				backgroundColor: "#f7f7f7",
				color: "#3d3d3d",
			},
		},
	},
});

export default theme;
