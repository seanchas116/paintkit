import React from "react";
import styled from "styled-components";
import menuIcon from "@iconify-icons/ic/outline-menu";
import paragraphIcon from "../icon/Paragraph";
import frameIcon from "../icon/Frame";
import { ToolBar } from "./toolbar/ToolBar";
import { ToolButton, ToolButtonArray } from "./toolbar/ToolButton";
import { ZoomControl } from "./toolbar/ZoomControl";
import { colors } from "./Palette";
import { VSplitter } from "./sidebar/VSplitter";
import {
  InspectorTabBar,
  InspectorTabBarItem,
} from "./sidebar/InspectorTabBar";
import { WidthResizeHandle } from "./sidebar/WidthResizeHandle";

const Columns = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  display: flex;
`;

const Center = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Viewport = styled.div`
  background-color: ${colors.uiBackground};
  flex: 1;
`;

const LeftSideBar = styled.div`
  position: relative;
  width: 200px;
  border-right: 2px solid ${colors.separator};
`;

const RightSideBar = styled.div`
  position: relative;
  width: 200px;
  border-left: 2px solid ${colors.separator};
  > * {
    height: 100%;
  }
`;

const EditorLayoutExample: React.FC = () => {
  const [splitRatio, setSplitRatio] = React.useState(0.5);
  const [leftWidth, setLeftWidth] = React.useState(200);
  const [rightWidth, setRightWidth] = React.useState(200);

  return (
    <Columns>
      <LeftSideBar
        style={{
          width: `${leftWidth}px`,
        }}
      >
        <WidthResizeHandle
          position="right"
          width={leftWidth}
          onChangeWidth={setLeftWidth}
        />
      </LeftSideBar>
      <Center>
        <ToolBar>
          <ToolButton label="Menu" icon={menuIcon} />

          <ToolButtonArray>
            <ToolButton label="Frame" icon={frameIcon} />
            <ToolButton label="Text" icon={paragraphIcon} />
          </ToolButtonArray>

          <ZoomControl
            percentage={100}
            onZoomIn={() => {}}
            onZoomOut={() => {}}
            onChangePercentage={() => {}}
          />
        </ToolBar>
        <Viewport />
      </Center>
      <RightSideBar
        style={{
          width: `${rightWidth}px`,
        }}
      >
        <VSplitter ratio={splitRatio} onChangeRatio={setSplitRatio}>
          <div>
            <InspectorTabBar>
              <InspectorTabBarItem aria-selected>Tab 1</InspectorTabBarItem>
              <InspectorTabBarItem>Tab 2</InspectorTabBarItem>
            </InspectorTabBar>
          </div>
          <div>
            <InspectorTabBar>
              <InspectorTabBarItem aria-selected>Tab 1</InspectorTabBarItem>
              <InspectorTabBarItem>Tab 2</InspectorTabBarItem>
            </InspectorTabBar>
          </div>
        </VSplitter>
        <WidthResizeHandle
          position="left"
          width={rightWidth}
          onChangeWidth={setRightWidth}
        />
      </RightSideBar>
    </Columns>
  );
};

export default {
  component: EditorLayoutExample,
  title: "EditorLayoutExample",
};

export const Basic: React.VFC = () => {
  return <EditorLayoutExample />;
};
