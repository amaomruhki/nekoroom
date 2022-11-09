import { ReactNode } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Container } from "@chakra-ui/react";

type Props = { children: ReactNode };

const Layout = ({ children }: Props) => {
	return (
		<>
			<Header />
			<Container maxW="800px" pt={8} pb={8} mt={20} mb={30}>
				{children}
			</Container>
			<Footer />
		</>
	);
};

export default Layout;
