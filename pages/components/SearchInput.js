import styled from "styled-components";

export default function SearchInput({
  placeholder,
  value,
  setValue,
  onFocus,
  containerStyles,
}) {
  return (
    <Container
      className={`${containerStyles} bg-white rounded-lg relative border`}
    >
      <LeftImage src="/search.svg" alt="search" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={onFocus}
        type="text"
        placeholder={placeholder}
      />
      {value ? (
        <RightImage
          className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={() => setValue("")}
          src={"/close.svg"}
          alt="delete"
        />
      ) : null}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const LeftImage = styled.img`
  position: absolute;
  left: 2%;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const RightImage = styled.img`
  position: absolute;
  right: 2%;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  font-size: 14px;
  background-color: #202c33;
  color: #aebac1;
  padding: 15px 15px 15px 40px;
  border-radius: 5px;
  outline: none;
  border: none;
`;
