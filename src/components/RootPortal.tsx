import React from "react";
import ReactDOM from "react-dom";

export class RootPortal extends React.Component<{ children: React.ReactNode }> {
  private el = document.createElement("div");

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
