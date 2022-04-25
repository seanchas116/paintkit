import React, { useMemo, useEffect } from "react";
import { observer } from "mobx-react";
import { computed, observable, makeObservable } from "mobx";
import styled from "styled-components";
import { MIXED } from "../../util/Mixed";
import { colors } from "../Palette";
import { ClickToEditInput } from "../ClickToEditInput";
import { LeafTreeViewItem, RootTreeViewItem } from "./TreeViewItem";
import { TreeView } from "./TreeView";

const DRAG_MIME = "application/x.paintkit-attribute-drag";

class KeyValueItem extends LeafTreeViewItem {
  constructor(parent: KeyValueListItem, key: string) {
    super();
    this.parent = parent;
    this.key = key;
    makeObservable(this);
  }
  readonly parent: KeyValueListItem;
  readonly key: string;

  @computed get value() {
    return this.parent.map.get(this.key);
  }

  @computed get selected(): boolean {
    return this.parent.selection.has(this.key);
  }
  get hovered(): boolean {
    return false;
  }
  renderRow(options: { inverted: boolean }): React.ReactNode {
    const value = this.value;

    return (
      <Row inverted={options.inverted}>
        <RowClickToEdit
          trigger="click"
          value={this.key}
          onChange={(newKey) => {
            const oldKey = this.key;
            const changed =
              this.parent.onChangeKey?.(this.key, newKey) ?? false;
            if (changed) {
              const newSelection = new Set(this.parent.selection);
              newSelection.delete(oldKey);
              newSelection.add(newKey);
              this.parent.updateSelection(newSelection);
            }
            return changed;
          }}
          disabled={!this.selected}
        />
        <RowClickToEdit
          trigger="click"
          value={value?.toString() ?? ""}
          placeholder={value == null ? "Multiple" : undefined}
          onChange={(value) => {
            return this.parent.onChangeValue?.(this.key, value) ?? false;
          }}
          disabled={!this.selected}
        />
      </Row>
    );
  }
  deselect(): void {
    const newSelection = new Set(this.parent.selection);
    newSelection.delete(this.key);
    this.parent.updateSelection(newSelection);
  }
  select(): void {
    const newSelection = new Set(this.parent.selection);
    newSelection.add(this.key);
    this.parent.updateSelection(newSelection);
  }

  handleDragStart(e: React.DragEvent) {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(DRAG_MIME, "drag");
  }
}

class KeyValueListItem extends RootTreeViewItem {
  constructor() {
    super();
    makeObservable(this);
  }

  @observable.ref map: ReadonlyMap<string, string | typeof MIXED> = new Map();
  @observable.ref selection: ReadonlySet<string> = new Set();

  updateSelection(selection: ReadonlySet<string>): void {
    this.selection = selection;
    this.onChangeSelection?.(new Set(selection));
  }

  onChangeSelection?: (selection: Set<string>) => void;
  onReorder?: (newKeys: Set<string>) => void;
  onChangeKey?: (key: string, newKey: string) => boolean;
  onChangeValue?: (key: string, value: string) => boolean;

  getAttributeKeys(): Set<string> {
    return new Set(this.map.keys());
  }

  get children(): KeyValueItem[] {
    return [...this.getAttributeKeys()].map(
      (key) => new KeyValueItem(this, key)
    );
  }

  deselect() {
    this.updateSelection(new Set());
  }

  canDropData(dataTransfer: DataTransfer) {
    return dataTransfer.types.includes(DRAG_MIME);
  }

  handleDrop(event: React.DragEvent, before: KeyValueItem | undefined): void {
    const attributeKeys = this.getAttributeKeys();

    for (const selected of this.selection) {
      attributeKeys.delete(selected);
    }

    const newAttributeKeys = new Set<string>();
    for (const attr of attributeKeys) {
      if (before?.key === attr) {
        // insert
        for (const selected of this.selection) {
          newAttributeKeys.add(selected);
        }
      }
      if (!this.selection.has(attr)) {
        newAttributeKeys.add(attr);
      }
    }
    if (!before) {
      for (const selected of this.selection) {
        newAttributeKeys.add(selected);
      }
    }

    this.onReorder?.(newAttributeKeys);
  }
}

export const KeyValueEdit: React.FC<{
  className?: string;
  keyHeader?: React.ReactNode;
  valueHeader?: React.ReactNode;
  map: ReadonlyMap<string, string | typeof MIXED>;
  selection: ReadonlySet<string>;
  onChangeSelection: (selection: Set<string>) => void;
  onReorder: (newKeys: Set<string>) => void;
  onChangeKey?: (key: string, newKey: string) => boolean;
  onChangeValue: (key: string, value: string) => boolean;
}> = observer(function KeyValueEdit({
  className,
  keyHeader = "Key",
  valueHeader = "Value",
  map,
  selection,
  onChangeSelection,
  onReorder,
  onChangeKey,
  onChangeValue,
}) {
  const rootItem = useMemo(() => new KeyValueListItem(), []);

  useEffect(() => {
    rootItem.map = map;
    rootItem.selection = selection;
    rootItem.onChangeSelection = onChangeSelection;
    rootItem.onReorder = onReorder;
    rootItem.onChangeKey = onChangeKey;
    rootItem.onChangeValue = onChangeValue;
  }, [
    map,
    selection,
    onChangeSelection,
    onReorder,
    onChangeKey,
    onChangeValue,
  ]);

  return (
    <TreeView
      className={className}
      header={
        <Header>
          <HeaderLabel>{keyHeader}</HeaderLabel>
          <HeaderLabel>{valueHeader}</HeaderLabel>
        </Header>
      }
      footer={<Footer />}
      mode="list"
      scroll={false}
      rootItem={rootItem}
    />
  );
});

const Header = styled.div`
  margin: 0 12px;
  display: flex;
`;

const Footer = styled.div`
  height: 12px;
`;

const HeaderLabel = styled.div`
  font-size: 10px;
  line-height: 12px;
  padding-bottom: 4px;
  color: ${colors.label};
  flex: 1;
`;

const Row = styled.div<{ inverted: boolean }>`
  height: 100%;
  margin: 0 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  color: ${(p) => (p.inverted ? colors.activeText : colors.text)};
`;

const RowClickToEdit = styled(ClickToEditInput)`
  font-size: 12px;
`;
