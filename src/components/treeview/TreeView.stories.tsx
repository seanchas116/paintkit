import { loremIpsum } from "lorem-ipsum";
import { computed, observable, makeObservable } from "mobx";
import React, { useState } from "react";
import styled from "styled-components";
import { TreeNode } from "../../util/TreeNode";
import { TreeRow, TreeRowLabel } from "./TreeRow";
import { TreeView } from "./TreeView";
import { TreeViewItem } from "./TreeViewItem";

const DRAG_MIME = "application/x.macaron-tree-drag";

class ExampleNode extends TreeNode<ExampleNode, ExampleNode, ExampleNode> {
  constructor(name: string, children: ExampleNode[], canHaveChildren: boolean) {
    super();
    this.rename(name);
    this.canHaveChildren = canHaveChildren;
    makeObservable(this);
    this.append(...children);
  }

  readonly canHaveChildren: boolean;

  @observable collapsed = false;

  @observable _selected = false;

  get selected() {
    return this._selected;
  }
  select() {
    this._selected = true;
    for (const child of this.children) {
      child.deselect();
    }
  }
  deselect() {
    this._selected = false;
    for (const child of this.children) {
      child.deselect();
    }
  }

  @computed.struct get selectedDescendants(): ExampleNode[] {
    if (this.selected) {
      return [this];
    }
    return this.children.flatMap((child) => child.selectedDescendants);
  }

  get root(): ExampleNode {
    return this.parent?.root ?? this;
  }

  newInstance(): ExampleNode {
    throw new Error("Method not implemented.");
  }

  toSelfData(): Node {
    throw new Error("Method not implemented.");
  }
  loadSelfData(json: unknown): void {
    throw new Error("Method not implemented.");
  }
  cloneSelf(): ExampleNode {
    return new ExampleNode(this.name, [], this.canHaveChildren);
  }

  static generate(
    depth: number,
    minChildCount: number,
    maxChildCount: number
  ): ExampleNode {
    const text: string = loremIpsum({
      sentenceLowerBound: 2,
      sentenceUpperBound: 4,
    });
    const hasChild = depth > 1;
    let children: ExampleNode[] = [];
    if (hasChild) {
      children = [];
      const childCount = Math.round(
        Math.random() * (maxChildCount - minChildCount) + minChildCount
      );
      for (let i = 0; i < childCount; ++i) {
        children.push(
          ExampleNode.generate(depth - 1, minChildCount, maxChildCount)
        );
      }
    }
    return new ExampleNode(text, children, hasChild);
  }
}

class ExampleTreeViewItem extends TreeViewItem {
  constructor(parent: ExampleTreeViewItem | undefined, node: ExampleNode) {
    super();
    this.parent = parent;
    this.node = node;
    makeObservable(this);
  }

  readonly parent: ExampleTreeViewItem | undefined;
  readonly node: ExampleNode;

  get children(): TreeViewItem[] {
    return this.node.children.map((c) => new ExampleTreeViewItem(this, c));
  }

  get key() {
    return this.node.key;
  }

  @computed get selected() {
    return this.node.selected;
  }
  @computed get collapsed() {
    return this.node.collapsed;
  }
  @computed get hovered() {
    return false;
  }
  get showsCollapseButton() {
    return !!this.node.firstChild;
  }

  deselect() {
    this.node.deselect();
  }

  select() {
    this.node.select();
  }

  toggleCollapsed() {
    this.node.collapsed = !this.node.collapsed;
  }

  handleDragStart(e: React.DragEvent) {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(DRAG_MIME, "drag");
  }

  canDropData(dataTransfer: DataTransfer) {
    return this.node.canHaveChildren && dataTransfer.types.includes(DRAG_MIME);
  }

  handleDrop(event: React.DragEvent, before: TreeViewItem | undefined) {
    const beforeNode = (before as ExampleTreeViewItem | undefined)?.node;
    TreeNode.moveNodes(
      this.node,
      beforeNode,
      this.node.root.selectedDescendants
    );
  }

  renderRow(options: { inverted: boolean }): React.ReactNode {
    return (
      <TreeRow inverted={options.inverted}>
        <TreeRowLabel>{this.node.name}</TreeRowLabel>
      </TreeRow>
    );
  }
}

export default {
  title: "TreeView",
  component: TreeView,
};

const StyledTreeView = styled(TreeView)`
  position: relative;
  width: 240px;
  height: 400px;
`;

export const Basic: React.VFC = () => {
  const [item] = useState(() => {
    const root = ExampleNode.generate(4, 3, 4);
    return new ExampleTreeViewItem(undefined, root);
  });

  return <StyledTreeView rootItem={item} />;
};

export const ManyItems: React.VFC = () => {
  const [item] = useState(() => {
    const root = ExampleNode.generate(4, 5, 5);
    return new ExampleTreeViewItem(undefined, root);
  });

  return <StyledTreeView rootItem={item} />;
};

export const NonReorderable: React.VFC = () => {
  const [item] = useState(() => {
    const root = ExampleNode.generate(4, 3, 4);
    return new ExampleTreeViewItem(undefined, root);
  });

  return <StyledTreeView rootItem={item} reorderable={false} />;
};

const PlaceholderText = styled.div`
  text-align: center;
`;

export const Placeholder: React.VFC = () => {
  const [item] = useState(() => {
    const root = new ExampleNode("", [], false);
    return new ExampleTreeViewItem(undefined, root);
  });

  return (
    <StyledTreeView
      rootItem={item}
      reorderable={false}
      placeholder={<PlaceholderText>Drop files here</PlaceholderText>}
    />
  );
};
