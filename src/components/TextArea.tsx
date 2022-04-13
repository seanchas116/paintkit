import styled from "styled-components";
import { colors } from "./Palette";

// TODO: Setup wrapper component

export const TextArea = styled.textarea`
  background: ${colors.uiBackground};
  border-radius: 4px;
  padding: 6px;
  font-size: 12px;
  color: ${colors.text};
  resize: vertical;

  ::placeholder {
    color: ${colors.disabledText};
  }

  :focus {
    box-shadow: 0 0 0 1px inset ${colors.active};
  }
`;
