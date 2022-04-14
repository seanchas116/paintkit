import styled from "styled-components";
import helpIcon from "@iconify-icons/ic/outline-help-outline";
import { Icon } from "@iconify/react/dist/offline";
import { colors } from "../Palette";

export const HelpIcon = styled(Icon).attrs({
  icon: helpIcon,
  width: 12,
  height: 12,
})``;

export const Pane = styled.div`
  padding: 12px;
  border-bottom: 2px solid ${colors.separator};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PaneHeading = styled.h2<{ dimmed?: boolean }>`
  margin: 0;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${(p) => (p.dimmed ? colors.disabledText : colors.text)};
`;

export const PaneSubHeading = styled(PaneHeading)`
  font-size: 10px;
  text-transform: uppercase;
  color: ${colors.disabledText};
`;

export const PaneHeadingRow = styled.div`
  height: 16px;
  margin-top: -2px;
  margin-bottom: -2px;

  display: flex;
  align-items: center;
  ${PaneHeading} {
    flex: 1;
  }
`;

export const RowPackLeft = styled.div`
  display: flex;
  gap: 8px;
`;

export const Row111 = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
`;

export const Row12 = styled(Row111)`
  > :nth-child(1) {
    grid-column: 1 / 2;
  }
  > :nth-child(2) {
    grid-column: 2 / 4;
  }
`;

export const Row21 = styled(Row111)`
  > :nth-child(1) {
    grid-column: 1 / 3;
  }
  > :nth-child(2) {
    grid-column: 3 / 4;
  }
`;

export const RowSpan12 = styled.div`
  grid-column: 1 / 3;
  display: flex;
`;

export const RowSpan23 = styled.div`
  grid-column: 2 / 4;
  display: flex;
`;

export const Row11 = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 1fr;
  align-items: center;
`;

export const RowGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
