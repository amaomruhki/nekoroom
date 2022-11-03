import { useEffect, useState } from "react";
import Footer from "../../components/layouts/Footer/Footer";
import Header from "../../components/layouts/Header/Header";
import NextLink from "next/link";
import {
	Image,
	Box,
	Container,
	Heading,
	HStack,
	VStack,
	Text,
	Textarea,
	Button,
	Stack,
	Icon,
	Flex,
	Spacer,
	Center,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	Link,
	IconButton,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import {
	addDoc,
	collection,
	writeBatch,
	increment,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	Timestamp,
	where,
	collectionGroup,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useRouter } from "next/router";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { userState } from "../../Atoms/userAtom";
import { useRecoilState } from "recoil";
import { uuid } from "uuidv4";
import Loading from "../../components/elements/Loading/Loading";

type Post = {
	postId: string;
	userId: string;
	username: string;
	userImg: string;
	image: string;
	caption: string;
	likeCount: number;
};

const MyPage = () => {
	const [posts, setPosts] = useState<Post[] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currentUser] = useRecoilState(userState);

	return (
		<>
			<Header />
			{!isLoading && currentUser ? (
				<Container>
					<VStack bg="white" p={4} mt="80px" rounded="md">
						<HStack p={2}>
							<Avatar
								size="md"
								name={currentUser.username}
								src={currentUser.userImg}
							/>
							<Text fontSize="md" as="b">
								{currentUser.username}
							</Text>
						</HStack>
						<Text fontSize="sm">
							愛猫くろしろ（MIX/保護猫/♂）のQOL向上のために駆け出したいエンジニア。
							シンプルでナチュラルなデザインの猫グッズでそろえています。
							#猫飼いエンジニアとつながりたいにゃ
						</Text>
						<Link href="/auth/register">
							<Text
								as="u"
								cursor="pointer"
								color="#E4626E"
								_hover={{ opacity: 0.8 }}
							>
								プロフィールを編集する
							</Text>
						</Link>
					</VStack>
					<VStack align="left" spacing={4} my={4}>
						<Heading as="h3" size="md">
							投稿したネコルーム
						</Heading>
					</VStack>
				</Container>
			) : (
				<Loading />
			)}

			<Footer />
		</>
	);
};

export default MyPage;
