import React from "react";
import styled from "styled-components";

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const App = () => {
  return (
    <>
      <ContextMenuTrigger id="same_unique_identifier">
        <div className="well">Rightddd click to see the menu</div>
      </ContextMenuTrigger>

      <ContextMenu id="same_unique_identifier">
        <MenuItem data={{ foo: "bar" }} onClick={() => {}}>
          ContextMenu Item 1
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
  );
};

const Component = styled.div``;

export default React.memo(App);
