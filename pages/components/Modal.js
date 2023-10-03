import { useEffect } from "react";
import styled from "styled-components";

export default function Modal({
  title,
  isVisible,
  onClose,
  children,
  className,
}) {
  useEffect(() => {
    if (isVisible) {
      if (document && document.body) {
        document.body.style.overflowY = "hidden";
      } else {
        document.body.style.overflowY = "auto";
      }
    }
    return () => {
      if (document && document.body) {
        document.body.style.overflowY = "auto";
      }
    };
  }, [isVisible]);
  return (
    <>
      {isVisible === true && (
        <>
          <Backdrop onClick={onClose} />
          <Container
            className={`slide-in-fwd-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]`}
          >
            <Main className={`${className}`}>
              <Title>{title}</Title>
              {children}
            </Main>
          </Container>
        </>
      )}
    </>
  );
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
`;

const Container = styled.div`
  z-index: 9999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Main = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: #202c33;
`;

const Title = styled.div`
  font-size: 20px;
  border-bottom: 1px solid gray;
  padding: 0px 20px 20px 20px;
  margin-bottom: 20px;
  font-weight: bold;
  color: white;
`;
