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

export default function Sidebar() {
  const [user] = useAuthState(auth);
  const [searchText, setSearchText] = useState("");
  const userChatRef = db
    .collection("chats")
    .where("user", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt(
      "Please enter a valid email address for the user to chat with"
    );
    if (!input) return null;
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      db.collection("chats").add({
        user: [user.email, input],
      });
    }
  };

  const chatAlreadyExists = (recipientEmail) => {
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users?.find((user) => user === recipientEmail)?.length > 0
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
    <div>
      <Container>
        <StickyContainer>
          <Header>
            <UserDetails>
              <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
              <UserEmail>{truncate(user.email)}</UserEmail>
            </UserDetails>
            <IconButton>
              <ChatIcon style={{ color: "#AEBAC1" }} onClick={createChat} />
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
        {filteredChats()?.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().user} />
        ))}
      </Container>
    </div>
  );
}

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
