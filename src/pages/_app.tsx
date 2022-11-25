import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../components/theme/theme";
import { RecoilRoot } from "recoil";
import Layout from "../components/layouts/Layout";


function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	return (
		<RecoilRoot>
			<ChakraProvider theme={theme}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</ChakraProvider>
		</RecoilRoot>
	);
}

export default MyApp;
