import { useEffect } from "react";
import NextLink from "next/link";
import MenuDrawer from "../../elements/Drawer/MenuDrawer";
import MenuIconButton from "../../elements/Button/MenuIconButton";
import {
	Container,
	Flex,
	useDisclosure,
	Image,
	Text,
	Link,
} from "@chakra-ui/react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
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
				const fetchUser = async () => {
					const docRef = doc(db, "users", user.uid);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists()) {
						const data = docSnap.data() as User;
						setCurrentUser(data);
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
		alert("ログアウトしました");
		router.push("/");
	};

	return (
		<>
			<Container
				p={0}
				borderBottom="1px"
				borderColor="gray.200"
				maxW="100%"
				sx={{ position: "fixed", zIndex: "99", top: 0 }}
			>
				<Container bg="#E4626E" maxW="100%" p={1}>
					<Text color="white" fontSize="sm" align="center">
						ネコ飼いさんのお部屋写真とアイテムシェアサイト
					</Text>
				</Container>
				<Container bg="white" py={2} px={4} maxW="100%">
					<Flex as="nav" justify="space-between" align="center">
						<NextLink href="/" passHref>
							<Link>
								<Image src="/logo.svg" alt="logo" width="158px" height="34px" />
							</Link>
						</NextLink>
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
