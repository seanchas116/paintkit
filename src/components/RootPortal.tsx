import React from "react";
import ReactDOM from "react-dom";
import { assertNonNull } from "../util/Assert";

const RootPortalHostContext =
  React.createContext<DocumentOrShadowRoot>(document);

export const RootPortalHostProvider = RootPortalHostContext.Provider;

interface RootPortalProps {
  children: React.ReactNode;
}

export class RootPortal extends React.Component<RootPortalProps> {
  static contextType = RootPortalHostContext;

  private el = document.createElement("div");

  constructor(props: RootPortalProps) {
    super(props);
  }

  componentDidMount(): void {
    const host = this.context as Document;
    const root = assertNonNull(host.querySelector(".paintkit-root"));
    root.appendChild(this.el);
  }

  componentWillUnmount(): void {
    this.el.remove();
  }

  render(): JSX.Element {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
