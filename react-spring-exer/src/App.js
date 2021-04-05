import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import ResizeObserver from "resize-observer-polyfill";
import styled, { css } from "styled-components";

import { BsArrowUpShort as UpIcon } from "react-icons/bs";
import { BsArrowDownShort as DownIcon } from "react-icons/bs";

const App = () => {
  const folderList = [
    {
      folderId: "1617356159df2e43f9",
      folderNm: "2",
      folderPid: "1613695900b27de145",
      placeId: "1613695900b27de145",
    },
    {
      folderId: "16173bbbd2aeebf5",
      folderNm: "7",
      folderPid: "161735616234eb1616",
      placeId: "1613695900b27de145",
    },
    {
      folderId: "161735615738b1af5a",
      folderNm: "1",
      folderPid: "161735616234eb1616",
      placeId: "1613695900b27de145",
    },
    {
      folderId: "161735616234eb1616",
      folderNm: "5",
      folderPid: "1613695900b27de145",
      placeId: "1613695900b27de145",
    },
    {
      folderId: "1617356165b26e3f6d",
      folderNm: "4",
      folderPid: "1613695900b27de145",
      placeId: "1613695900b27de145",
    },
    {
      folderId: "1617356cccebf5",
      folderNm: "8",
      folderPid: "1617356165b26e3f6d",
      placeId: "1613695900b27de145",
    },
    {
      folderId: "1617356168d2aeebf5",
      folderNm: "3",
      folderPid: "1617356165b26e3f6d",
      placeId: "1613695900b27de145",
    },
    {
      folderId: "1617356168d2aeeaaa",
      folderNm: "6",
      folderPid: "1617356168d2aeebf5",
      placeId: "1613695900b27de145",
    },
  ];
 
  const rootFolder = {
    folderId: "1613695900b27de145",
    folderPid: "1613695900b27de145",
    placeId: "1613695900b27de145",
    folderNm: "없음",
    folderPathNm: "없음",
    childFolderList: [],
  };

  let newFolderList = [...[rootFolder], ...folderList];

  folderList.sort(function (a, b) {
    if (a.folderNm && b.folderNm) {
      return a.folderNm > b.folderNm ? 1 : a.folderNm < b.folderNm ? -1 : 0;
    } else {
      return 0;
    }
  });

  for (const folder of newFolderList) {
    folder.childFolderList = folderList.filter(filterFolder => filterFolder.folderPid === folder.folderId);
  }

  let rootFolderList = newFolderList[0].childFolderList;
  let sortFolderList = [];
  for (let i = 0; i < rootFolderList.length; i++) {
    let childFolderList = [rootFolderList[i]];

    while (childFolderList.length !== 0) {
      const node = childFolderList.pop();
      sortFolderList.push(node);
      if (node.childFolderList.length) {
        childFolderList = [...node.childFolderList, ...childFolderList];
      }
    }
  }
  // newFolderList = [...[rootFolder], ...sortFolderList];

  // for (const folder of folderList) {
  //   folder.folderPathNm = folder.folderNm;
  //   let currentFolder = folder;
  //   let condition = true;
  //   while (condition) {
  //     if (currentFolder.folderPid !== placeId) {
  //       const parentFolder = folderList.find(
  //         (parentFolder) => parentFolder.folderId === currentFolder.folderPid
  //       );
  //       if (parentFolder) {
  //         currentFolder = parentFolder;
  //       }
  //       folder.folderPathNm =
  //         currentFolder.folderNm + " / " + folder.folderPathNm;
  //     } else {
  //       condition = false;
  //     }
  //   }
  // }
  console.log(newFolderList[0].childFolderList);
  return (
    <>
      <DropdownWrap>
        <DropdownTitle isOpen={true}>zzz</DropdownTitle>
        <DropdownMenu style={{ display: "block" }}>
          <DropDownContents>
            {folderList.map((folder) => {
              if (folder.placeId === folder.folderPid) {
                return <Folder key={folder.folderId} folderInfo={folder} />;
              } else {
                return null;
              }
            })}
          </DropDownContents>
        </DropdownMenu>
      </DropdownWrap>
    </>
  );
};

const Folder = memo(({ children, folderInfo }) => {
  const { folderNm, childFolderList } = folderInfo;
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  const previous = usePrevious(isFolderOpen);
  const [bind, { height: viewHeight }] = useMeasure();
  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      height: isFolderOpen ? viewHeight : 0,
      opacity: isFolderOpen ? 1 : 0,
      transform: `translate3d(${isFolderOpen ? 0 : 20}px,0,0)`,
    },
  });

  // 폴더 토글 하기
  const handleToggleFolder = useCallback(() => {
    setIsFolderOpen(!isFolderOpen);
  }, [isFolderOpen]);

  return (
    <Container>
      <TitleWrap>
        <TitleDiv onClick={handleToggleFolder}>
          {isFolderOpen ? (
            <UpIcon
              size={15}
              color="#999999"
              style={{ opacity: children ? 1 : 0.7 }}
            />
          ) : (
            <DownIcon
              size={15}
              color="#999999"
              style={{ opacity: children ? 1 : 0.7 }}
            />
          )}
          <Title>{folderNm}</Title>
        </TitleDiv>
      </TitleWrap>
      <Content
        style={{
          opacity,
          height: isFolderOpen && previous === isFolderOpen ? "auto" : height,
        }}
      >
        <div style={{ transform }} {...bind}>
          {childFolderList.map((folder) => (
            <Folder key={folder.folderId} folderInfo={folder} />
          ))}
        </div>
      </Content>
    </Container>
  );
});

// react-spring custom hook 사용
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => void (ref.current = value), [value]);

  return ref.current;
}

function useMeasure() {
  const ref = useRef();
  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [ro] = useState(
    () => new ResizeObserver(([entry]) => set(entry.contentRect))
  );

  useEffect(() => {
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ro]);

  return [{ ref }, bounds];
}

const DropdownWrap = styled.div`
  position: relative;
`;

const DropdownTitle = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 0.0625rem solid #f1f1f1;
  border-radius: 0.375rem;
  box-shadow: 0 0 0.1875rem 0 rgba(16, 16, 16, 0.12);
  width: 22.8125rem;
  height: 3.125rem;
  padding: 0 0.9375rem;
  transition: background 0.3s, opacity 0.3s;
  background: #ffffff;

  cursor: pointer;
  transition: border-color 0.3s;

  & > svg {
    margin-left: auto;
  }

  .title {
    font-size: 1rem;
    font-weight: 500;
    color: #666666;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 1.25rem;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 0.3em 1em rgb(0 0 0 / 15%);
  border: 0.0625rem solid #f1f1f1;
  border-radius: 0.375rem;
  z-index: 1;
`;

const DropDownContents = styled.div`
  padding-top: 0.625rem;
  border-top: 0.0625rem solid #efeff4;
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: overlay;

  &::-webkit-scrollbar {
    width: 0.375rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cccccc;
    border-radius: 0.1563rem;
  }
`;

const Container = styled.div`
  position: relative;
  font-weight: normal;
  font-size: 0.875rem;
  color: #999999;
`;

const TitleWrap = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 3.125rem;
  padding-left: 1.25rem;
  cursor: pointer;

  ${({ playlist }) =>
    playlist &&
    css`
      &:hover {
        background-color: #f9f9f9;
      }
    `}

  &.active {
    background: #eaf6ff;
    color: #2a91df;
    & path {
      fill: #2a91df;
    }
  }
`;

const TitleDiv = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  & > svg {
    margin-right: 0.625rem;
  }
`;

const Title = styled.div`
  max-width: calc(100% - 4rem);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Content = styled(animated.div)`
  will-change: transform, opacity, height;
  border-left: 0.0625rem dashed rgba(255, 255, 255, 0.4);
  padding-left: 1.25rem;
  overflow: hidden;
`;

export default App;
