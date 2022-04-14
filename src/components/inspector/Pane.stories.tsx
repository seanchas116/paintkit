import Tippy from "@tippyjs/react";
import React from "react";
import styled from "styled-components";
import icon_format_italic from "@iconify-icons/ic/outline-format-italic";
import icon_strikethrough_s from "@iconify-icons/ic/outline-strikethrough-s";
import icon_format_underlined from "@iconify-icons/ic/outline-format-underlined";
import { ComboBox } from "../ComboBox";
import { IconButton, PlusButton } from "../IconButton";
import { Select } from "../Select";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  Row11,
  RowGroup,
} from "./Inspector";

export default {
  component: Pane,
  title: "Pane",
};

const CheckableIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Panes = styled.div`
  width: 256px;
`;

export const Basic: React.VFC = () => {
  return (
    <Panes>
      <Pane>
        <PaneHeading>Text</PaneHeading>
        <RowGroup>
          <ComboBox
            value={"Times"}
            options={["Times", "Helvetica"].map((value) => ({ value }))}
            onChange={(value) => {
              // TODO
              return false;
            }}
          />
          <Row11>
            <Select
              value={"100"}
              placeholder="Weight"
              options={[
                { value: "100", text: "Thin" },
                { value: "200", text: "Extra Light" },
                { value: "300", text: "Light" },
                { value: "400", text: "Normal" },
                { value: "500", text: "Medium" },
                { value: "600", text: "Semi Bold" },
                { value: "700", text: "Bold" },
                { value: "800", text: "Extra Bold" },
                { value: "900", text: "Black" },
              ]}
              onChange={(value: string) => {
                // TODO
              }}
            />
            <CheckableIcons>
              <Tippy content="Italic">
                <IconButton
                  icon={icon_format_italic}
                  onClick={() => {
                    // TODO
                  }}
                />
              </Tippy>
              <Tippy content="Underline">
                <IconButton
                  icon={icon_format_underlined}
                  onClick={() => {
                    // TODO
                  }}
                />
              </Tippy>
              <Tippy content="Strikethrough">
                <IconButton
                  icon={icon_strikethrough_s}
                  onClick={() => {
                    // TODO
                  }}
                />
              </Tippy>
            </CheckableIcons>
          </Row11>
        </RowGroup>
      </Pane>
      <Pane>
        <PaneHeadingRow>
          <PaneHeading dimmed>Fill</PaneHeading>
          <PlusButton />
        </PaneHeadingRow>
      </Pane>
      <Pane>
        <PaneHeadingRow>
          <PaneHeading dimmed>Border</PaneHeading>
          <PlusButton />
        </PaneHeadingRow>
      </Pane>
    </Panes>
  );
};
