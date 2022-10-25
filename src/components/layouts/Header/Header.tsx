import { useEffect } from "react";
import Image from "next/image";
import MenuDrawer from "../../elements/Drawer/MenuDrawer";
import MenuIconButton from "../../elements/Button/MenuIconButton";
import { Container, Flex, useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../../../../lib/firebase";
import { useRecoilState } from "recoil";
import { userState } from "../../../Atoms/userAtom";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

const Header = () => {
	const [currentUser, setCurrentUser] = useRecoilState(userState);
	const auth = getAuth();
	const router = useRouter();
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				console.log(user);
				const fetchUser = async () => {
					const docRef = doc(db, "users", user.auth.currentUser.uid);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists()) {
						setCurrentUser(docSnap.data());
					}
				};
				fetchUser();
			}
		});
		return () => unsubscribe();
	}, [auth, setCurrentUser]);

	const onLogout = () => {
		signOut(auth);
		setCurrentUser(null);
		router.push("/");
	};

	return (
		<>
			<Container
				bg="white"
				borderBottom="1px"
				borderColor="gray.200"
				py={2}
				maxW="100%"
				sx={{ position: "fixed", zIndex: "99", top: 0 }}
			>
				<Container maxW="810px">
					<Flex as="nav" justify="space-between" align="center">
						<Link href="/">
							<Image src="/logo.svg" alt="logo" width="158px" height="34px" />
						</Link>
						<MenuIconButton onOpen={onOpen} />
						<MenuDrawer
							onClose={onClose}
							isOpen={isOpen}
							onLogout={onLogout}
							currentUser={currentUser}
						/>
					</Flex>
				</Container>
			</Container>
		</>
	);
};

export default Header;
