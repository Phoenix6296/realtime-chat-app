import { Avatar, IconButton } from "@material-ui/core";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat";
import * as EmailValidator from "email-validator";
import { auth, db } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Chat from "./Chat";
import { SearchInput } from "./SearchInput";
import { useState } from "react";
import { truncate } from "../../utils/helper";
import Modal from "./Modal";

export default function Sidebar() {
  const [user] = useAuthState(auth);
  const [searchText, setSearchText] = useState("");
  const [email, setEmail] = useState("");
  const [addChatModal, showAddChatModal] = useState(false);
  const userChatRef = db
    .collection("chats")
    .where("user", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const resetModal = () => {
    showAddChatModal(false);
    setEmail("");
  };

  const createChat = (event) => {
    event.preventDefault();
    if (
      EmailValidator.validate(email) &&
      !chatAlreadyExists(email) &&
      email !== user.email
    ) {
      db.collection("chats").add({
        user: [user.email, email],
      });
      resetModal();
    }
  };

  const chatAlreadyExists = (recipientEmail) => {
    return !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().user?.find((user) => user === recipientEmail)?.length > 0
    );
  };

  const filteredChats = () => {
    if (!searchText.trim()) return chatsSnapshot?.docs;
    return chatsSnapshot?.docs.filter((doc) => {
      const users = doc.data().user;
      return users.some((userEmail) => userEmail.includes(searchText));
    });
  };

  return (
    <Container>
      <StickyContainer>
        <Header>
          <UserDetails>
            <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
            <UserEmail>{truncate(user.email)}</UserEmail>
          </UserDetails>
          <IconButton>
            <ChatIcon
              style={{ color: "#AEBAC1" }}
              onClick={() => showAddChatModal(true)}
            />
          </IconButton>
        </Header>
        <Search>
          <SearchInput
            placeholder="Search or start new chat"
            value={searchText}
            setValue={setSearchText}
          />
        </Search>
      </StickyContainer>
      {filteredChats()?.length > 0 ? (
        filteredChats()?.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().user} />
        ))
      ) : (
        <NoChat>No Chats</NoChat>
      )}
      <Modal title={"Add Chat"} isVisible={addChatModal} onClose={resetModal}>
        <Form>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ButtonContainer>
            <button
              type="submit"
              onClick={createChat}
              disabled={email.trim() === ""}
            >
              Create
            </button>
          </ButtonContainer>
        </Form>
      </Modal>
    </Container>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  min-width: 500px;
  background-color: #202c33;
  > input {
    border: none;
    border-radius: 10px;
    padding: 20px;
    background-color: #111b21;
    color: #aebac1;
    font-size: 16px;
    ::placeholder {
      color: #aebac1;
    }
  }
  > div > button {
    border: none;
    border-radius: 10px;
    padding: 20px;
    width: 30%;
    background-color: #aebac1;
    color: #111b21;
    font-size: 16px;
    cursor: pointer;
    :hover {
      background-color: #111b21;
      color: #aebac1;
    }
    :disabled {
      cursor: not-allowed;
      background-color: #aebac1;
      color: #111b21;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const UserDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const UserEmail = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #aebac1;
`;
const StickyContainer = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  flex-direction: column;
  flex: 1;
`;
const NoChat = styled.div`
  color: #aebac1;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  padding: 20px;
`;
const Container = styled.div`
  flex: 0.45;
  border-right: 0.5px solid #aebac1;
  height: 100vh;
  background-color: #111b21;
  font-size: 20px;
  min-width: 30vw;
  max-width: 35vw;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: #202c33;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const Search = styled.div`
  display: flex;
  background-color: #111b21;
  align-items: center;
  padding: 14px;
  border-bottom: 1px solid #aebac1;
`;
