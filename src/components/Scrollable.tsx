import React from "react";
import SimpleBar from "simplebar-react";
import styled from "styled-components";

const ScrollableContent = styled.div`
  display: flow-root;
`;

const ScrollableWrap = styled(SimpleBar)`
  contain: strict;
  min-width: 0;
  min-height: 0;
`;

export const Scrollable: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <ScrollableWrap className={className}>
      <ScrollableContent>{children}</ScrollableContent>
    </ScrollableWrap>
  );
};
