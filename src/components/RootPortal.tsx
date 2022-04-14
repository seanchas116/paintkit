import React from "react";
import ReactDOM from "react-dom";

interface RootPortalProps {
  children: React.ReactNode;
}

export class RootPortal extends React.Component<RootPortalProps> {
  private el = document.createElement("div");

  constructor(props: RootPortalProps) {
    super(props);
    this.el.className = "paintkit-root";
  }

  componentDidMount(): void {
    document.body.appendChild(this.el);
  }

  componentWillUnmount(): void {
    document.body.removeChild(this.el);
  }

  render(): JSX.Element {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
