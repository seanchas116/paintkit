import React from "react";
import ReactDOM from "react-dom";
import { assertNonNull } from "../util/Assert";

interface RootPortalProps {
  children: React.ReactNode;
}

export class RootPortal extends React.Component<RootPortalProps> {
  private el = document.createElement("div");

  constructor(props: RootPortalProps) {
    super(props);
  }

  componentDidMount(): void {
    const root = assertNonNull(document.querySelector(".paintkit-root"));
    root.appendChild(this.el);
  }

  componentWillUnmount(): void {
    this.el.remove();
  }

  render(): JSX.Element {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
