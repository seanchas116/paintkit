import React, { ReactNode } from "react";
import { computed, makeObservable } from "mobx";
import { colors } from "../../component/Palette";

export abstract class TreeViewItem {
  abstract readonly key: string;
  abstract readonly parent: TreeViewItem | undefined;
  abstract readonly children: readonly TreeViewItem[];
  abstract readonly selected: boolean;
  abstract readonly hovered: boolean;
  abstract readonly collapsed: boolean;
  abstract readonly showsCollapseButton: boolean;

  get activeColor(): string {
    return colors.active;
  }
  get activeTransparentColor(): string {
    return colors.activeTransparent;
  }

  constructor() {
    makeObservable(this);
  }

  get root(): TreeViewItem {
    return this.parent ? this.parent.root : this;
  }

  renderRowBackground(): ReactNode {
    return <></>;
  }
  abstract renderRow(options: { inverted: boolean }): ReactNode;

  abstract deselect(): void;
  abstract select(): void;
  abstract toggleCollapsed(): void;

  handleDoubleClick(e: React.MouseEvent): void {}
  handleContextMenu(e: React.MouseEvent): void {}

  handleMouseEnter(): void {}
  handleMouseLeave(): void {}
  handleDragStart(event: React.DragEvent): void {}
  canDropData(dataTransfer: DataTransfer): boolean {
    return false;
  }
  handleDragEnd(): void {}
  handleDrop(event: React.DragEvent, before: TreeViewItem | undefined): void {}

  @computed get ancestorSelected(): boolean {
    return this.selected || (this.parent?.ancestorSelected ?? false);
  }
}

export abstract class RootTreeViewItem extends TreeViewItem {
  get key(): string {
    return "";
  }
  get parent(): TreeViewItem | undefined {
    return undefined;
  }
  get selected(): boolean {
    return false;
  }
  get hovered(): boolean {
    return false;
  }
  get collapsed(): boolean {
    return false;
  }
  get showsCollapseButton(): boolean {
    return false;
  }

  renderRow(): ReactNode {
    return <></>;
  }

  select(): void {}
  toggleCollapsed(): void {}
}

export abstract class LeafTreeViewItem extends TreeViewItem {
  get children(): readonly TreeViewItem[] {
    return [];
  }
  get collapsed(): boolean {
    return false;
  }
  get showsCollapseButton(): boolean {
    return false;
  }
  toggleCollapsed(): void {}
}

export class EmptyTreeViewItem extends RootTreeViewItem {
  get children(): TreeViewItem[] {
    return [];
  }
  deselect(): void {}
}
