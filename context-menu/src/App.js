import React from "react";
import styled from "styled-components";

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const App = () => {
  const array = [...Array(5)].map((a, index) => ({
    id: index + '1',
    name: index + 1,
  }));

  return (
    <Container>
      <GridLayout>
        {array.map((item) => (
          <Box key={item.id} item={item} />
        ))}
      </GridLayout>
    </Container>
  );
};

const Box = ({ isSelect, item }) => {
  return (
    <>
      <ContextMenuTrigger
        id={item.id}
      // onDoubleClick={() => handleDoubleClickPlaylist(playlistId)}
      // onClick={(e) => handleClickPlaylist(e, playlistId)}
      // onContextMenu={() => handleContextMenuShow(playlistId)}
      >
        <CardBorder isSelect={isSelect} />
        <Resolution>1920 x 1080</Resolution>
        <Name>{item.name}</Name>
      </ContextMenuTrigger>
      <ContextMenu id={item.id}>
        <MenuItem data={{ foo: "bar" }} onClick={() => {}}>
          {item.name}
        </MenuItem>
        <MenuItem data={{ foo: "bar" }} onClick={() => {}}>
          ContextMenu Item 2
        </MenuItem>
        <MenuItem divider />
        <MenuItem data={{ foo: "bar" }} onClick={() => {}}>
          ContextMenu Item 3
        </MenuItem>
      </ContextMenu>
    </>
    // </ContextMenuTrigger>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const GridLayout = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  grid-gap: 32px;
  user-select: none;
  padding: 1rem;
  .react-contextmenu-wrapper {
    position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 6px;
  width: 100%;
  height: 156px;
  }
`;

const CardBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  z-index: 1;
  border: ${({ isSelect }) =>
    isSelect ? "2px solid #2a91df" : "1px solid rgba(0, 0, 0, 0.1)"};
`;

const Name = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 56px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Resolution = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: calc(100% - 56px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default React.memo(App);
