import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/dist/client/router";
export default function Chat({ key, id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );
  const enterChat = () => {
    router.push(`/chat/${id}`);
  };
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);
  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Container>
  );
}

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px 0;
  color: white;
  font-size: 16px;
  border-bottom: 1px solid #aebac1;
  word-break: break-word;
  :hover {
    background-color: #202c33;
  }
`;
