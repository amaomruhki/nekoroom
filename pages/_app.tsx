// import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../components/theme/theme";
import { RecoilRoot } from "recoil";
import { useAuth } from "../components/elements/Auth/auth";
import Loading from "../components/elements/Loading/Loading";
import { ReactNode } from "react";

// type Props = { children: ReactNode };

// const Auth = ({ children: Props }): JSX.Element => {
// 	const isLoading = useAuth();
// 	return isLoading ? <Loading /> : children;
// };

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	return (
		<RecoilRoot>
			<ChakraProvider theme={theme}>
				{/* <Auth> */}
				<Component {...pageProps} />
				{/* </Auth> */}
			</ChakraProvider>
		</RecoilRoot>
	);
}

export default MyApp;
