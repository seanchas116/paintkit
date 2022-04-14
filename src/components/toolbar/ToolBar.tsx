import styled from "styled-components";
import { colors } from "../Palette";

export const ToolBar = styled.div`
  height: 34px;
  border-bottom: 2px solid ${colors.separator};

  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  contain: strict;
`;
