import styled, { css } from "styled-components";
import React, { createRef, useEffect, useMemo } from "react";
import { action, observable, makeObservable } from "mobx";
import { observer } from "mobx-react";
import SimpleBar from "simplebar-react";
import { findIndex, findLastIndex, first } from "lodash-es";
import keyboardArrowDownIcon from "@iconify-icons/ic/outline-keyboard-arrow-down";
import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { colors } from "../Palette";
import { CurrentFocus } from "@seanchas116/paintkit/src/util/CurrentFocus";
import { iconToDataURL } from "@seanchas116/paintkit/src/util/Image";
import { EmptyTreeViewItem, TreeViewItem } from "./TreeViewItem";

const keyboardArrowDownIconURL = iconToDataURL(keyboardArrowDownIcon);

const currentFocus = new CurrentFocus();

//// ItemRow

interface ItemRow {
  item: TreeViewItem;
  depth: number;
}

function getItemRows(item: TreeViewItem, depth: number): ItemRow[] {
  return [
    { item, depth },
    ...(item.collapsed
      ? []
      : item.children.flatMap((child) => getItemRows(child, depth + 1))),
  ];
}

//// TreeViewContext

type DropIndicator =
  | {
      type: "bar";
      top: number;
      depth: number;
    }
  | {
      type: "over";
      top: number;
      height: number;
    };

class DropLocation {
  constructor(
    parent: TreeViewItem,
    before: TreeViewItem | undefined,
    indicator: DropIndicator
  ) {
    this.parent = parent;
    this.before = before;
    this.indicator = indicator;
  }

  readonly parent: TreeViewItem;
  readonly before: TreeViewItem | undefined;
  readonly indicator: DropIndicator;

  canDropData(dataTransfer: DataTransfer): boolean {
    return this.parent.canDropData(dataTransfer);
  }

  handleDrop(event: React.DragEvent): boolean {
    if (!this.canDropData(event.dataTransfer)) {
      return false;
    }
    this.parent.handleDrop(event, this.before);
    return true;
  }
}

class TreeViewContext {
  constructor(opts: {
    rootItem: TreeViewItem;
    invertsSelectionColor: boolean;
    reorderable: boolean;
    mode: "tree" | "list";
  }) {
    makeObservable(this);
    this.rootItem = opts.rootItem;
    this.invertedSelectionColor = opts.invertsSelectionColor;
    this.reorderable = opts.reorderable;
    this.mode = opts.mode;
  }

  readonly rootItem: TreeViewItem;
  readonly invertedSelectionColor: boolean;
  readonly reorderable: boolean;
  readonly mode: "tree" | "list";
  readonly itemToDOM = new WeakMap<TreeViewItem, HTMLElement>();
  headerDOM: HTMLElement | undefined;
  dragImage: HTMLElement | undefined;

  @observable treeViewHovered = false;

  @observable dropLocation: DropLocation | undefined = undefined;

  getItemRows(): ItemRow[] {
    return this.mode === "tree"
      ? this.rootItem.children.flatMap((item) => getItemRows(item, 0))
      : this.rootItem.children.map((item) => ({ item, depth: 0 }));
  }

  getHeaderBottom(): number {
    if (!this.headerDOM) {
      return 0;
    }
    return this.headerDOM.offsetTop + this.headerDOM.offsetHeight;
  }

  getItemDOMTop(item: TreeViewItem): number {
    return this.itemToDOM.get(item)?.offsetTop ?? 0;
  }
  getItemDOMHeight(item: TreeViewItem): number {
    return this.itemToDOM.get(item)?.offsetHeight ?? 0;
  }
  getItemDOMBottom(item: TreeViewItem): number {
    const dom = this.itemToDOM.get(item);
    if (!dom) {
      return 0;
    }
    return dom.offsetTop + dom.offsetHeight;
  }

  getDropLocationOver(item: TreeViewItem): DropLocation {
    return new DropLocation(item, item.children[0], {
      type: "over",
      top: this.getItemDOMTop(item),
      height: this.getItemDOMHeight(item),
    });
  }

  getDropLocationBetween(
    rows: ItemRow[],
    index: number,
    dropDepth: number
  ): DropLocation {
    if (rows.length === 0) {
      return new DropLocation(this.rootItem, undefined, {
        type: "bar",
        top: 0,
        depth: 0,
      });
    }

    if (index === 0) {
      return new DropLocation(
        assertNonNull(rows[0].item.parent),
        rows[0].item,
        {
          type: "bar",
          top: this.getItemDOMTop(rows[0].item),
          depth: rows[0].depth,
        }
      );
    }

    const rowPrev = rows[index - 1];
    const rowNext = index < rows.length ? rows[index] : undefined;

    if (!rowNext || rowNext.depth < rowPrev.depth) {
      if (rowNext && dropDepth <= rowNext.depth) {
        //   Prev
        // ----
        // Next
        return new DropLocation(
          assertNonNull(rowNext.item.parent),
          rowNext.item,
          {
            type: "bar",
            top: this.getItemDOMTop(rowNext.item),
            depth: rowNext.depth,
          }
        );
      }

      //     Prev
      //     ----
      // Next
      // or
      //     Prev
      //   ----
      // Next
      // or
      //     Prev
      //   ----
      // (no next items)

      const depth = Math.min(dropDepth, rowPrev.depth);
      const up = rowPrev.depth - depth;

      let parent = rowPrev.item.parent;
      for (let i = 0; i < up; ++i) {
        parent = parent?.parent;
      }

      return new DropLocation(assertNonNull(parent), undefined, {
        type: "bar",
        top: this.getItemDOMBottom(rowPrev.item),
        depth: depth,
      });
    } else {
      //  Prev
      //  ----
      //  Next
      // or
      //  Prev
      //    ----
      //    Next
      //
      return new DropLocation(
        assertNonNull(rowNext.item.parent),
        rowNext.item,
        {
          type: "bar",
          top: this.getItemDOMTop(rowNext.item),
          depth: rowNext.depth,
        }
      );
    }
  }
}

//// TreeRow

const treeCollapseButtonSize = 16;

const treeIndentation = 16;

function getDropDepth(e: React.DragEvent): number {
  const rect = e.currentTarget.getBoundingClientRect();
  return Math.max(
    Math.round(
      (e.clientX - rect.left - treeCollapseButtonSize) / treeIndentation
    ),
    0
  );
}

const TreeCollapseButton = styled.div<{
  collapsed: boolean;
  visible: boolean;
}>`
  color: ${colors.icon};
  visibility: ${(p) => (p.visible ? "visible" : "hidden")};
  --collapsed: ${(p) => (p.collapsed ? 1 : 0)};
  width: ${treeCollapseButtonSize}px;
  height: ${treeCollapseButtonSize}px;
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: "";
    width: 12px;
    height: 12px;
    background-color: currentColor;
    mask-image: url(${keyboardArrowDownIconURL});
    mask-size: 12px;
    transform: rotate(calc(var(--collapsed) * -90deg));
    transition: transform 0.1s;
  }
`;

const TreeRowContent = styled.div`
  flex: 1;
  min-width: 0;
  align-self: stretch;
`;

const treeViewHoverStyles = css`
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border: 1px solid var(--treeview-active);
    pointer-events: none;
  }
`;

const TreeRowWrap = styled.div<{
  depth: number;
  selected: boolean;
  ancestorSelected: boolean;
  hovered: boolean;
  activeColor: string;
  activeTransparentColor: string;
}>`
  --depth: ${(p) => p.depth};
  width: 100%;
  padding-left: calc(var(--depth) * ${treeIndentation}px);
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;

  --treeview-active: ${(p) => p.activeColor};
  --treeview-active-partial: ${(p) => p.activeTransparentColor};

  ${(p) =>
    !p.selected &&
    css`
      ${p.hovered && treeViewHoverStyles}
      &:hover {
        ${treeViewHoverStyles}
      }
    `}

  ${(p) =>
    p.selected &&
    css`
      background-color: var(--treeview-active);
      ${TreeCollapseButton} {
        color: ${colors.activeText};
      }
    `}
  ${(p) =>
    p.ancestorSelected &&
    !p.selected &&
    css`
      background-color: var(--treeview-active-partial);
    `}
`;

const TreeRow = observer(function TreeRow({
  context,
  rows,
  index,
}: {
  context: TreeViewContext;
  rows: ItemRow[];
  index: number;
}) {
  const { item, depth } = rows[index];

  const getDropLocation = (e: React.DragEvent): DropLocation | undefined => {
    if (!item.parent) {
      throw new Error("item must have parent");
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const dropPos = (e.clientY - rect.top) / rect.height;
    const dropDepth = getDropDepth(e);

    const locationBefore = context.getDropLocationBetween(
      rows,
      index,
      dropDepth
    );
    const locationOver = context.getDropLocationOver(item);
    const locationAfter = context.getDropLocationBetween(
      rows,
      index + 1,
      dropDepth
    );

    if (context.reorderable) {
      if (locationOver.canDropData(e.dataTransfer)) {
        if (locationBefore.canDropData(e.dataTransfer) && dropPos < 1 / 4) {
          return locationBefore;
        }
        if (locationAfter.canDropData(e.dataTransfer) && 3 / 4 < dropPos) {
          return locationAfter;
        }
        return locationOver;
      } else {
        if (locationBefore.canDropData(e.dataTransfer) && dropPos < 1 / 2) {
          return locationBefore;
        }
        if (locationAfter.canDropData(e.dataTransfer)) {
          return locationAfter;
        }
      }
    } else {
      const locationOverParent = context.getDropLocationOver(item.parent);
      if (locationOver.canDropData(e.dataTransfer)) {
        return locationOver;
      } else if (locationOverParent.canDropData(e.dataTransfer)) {
        return locationOverParent;
      }
    }
  };

  const onClick = action((event: React.MouseEvent<HTMLElement>) => {
    if (event.shiftKey) {
      let firstSelectedIndex = findIndex(rows, (row) => row.item.selected);
      if (firstSelectedIndex < 0) {
        firstSelectedIndex = index;
      }
      let lastSelectedIndex = findLastIndex(rows, (row) => row.item.selected);
      if (lastSelectedIndex < 0) {
        lastSelectedIndex = index;
      }
      const first = Math.min(firstSelectedIndex, lastSelectedIndex, index);
      const last = Math.max(firstSelectedIndex, lastSelectedIndex, index);
      for (let i = first; i <= last; ++i) {
        const item = rows[i].item;
        if (!item.parent?.selected) {
          item.select();
        }
      }
      return;
    }

    if (!event.metaKey) {
      context.rootItem.deselect();
    }
    item.select();
  });
  const onCollapseButtonClick = action((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    item.toggleCollapsed();
  });
  const onDragStart = action((e: React.DragEvent<HTMLElement>) => {
    if (!item.selected) {
      context.rootItem.deselect();
      item.select();
    }

    item.handleDragStart(e);

    if (context.dragImage) {
      e.dataTransfer.setDragImage(context.dragImage, 0, 0);
    }
  });
  const onDragEnd = action((e: React.DragEvent<HTMLElement>) => {
    item.handleDragEnd();
  });
  const onMouseEnter = action(() => {
    item.handleMouseEnter();
  });
  const onMouseLeave = action(() => {
    item.handleMouseLeave();
  });
  const onDoubleClick = action((e: React.MouseEvent) => {
    item.handleDoubleClick(e);
  });
  const onContextMenu = action((e: React.MouseEvent) => {
    if (!item.selected) {
      context.rootItem.deselect();
      item.select();
    }
    item.handleContextMenu(e);
  });

  const onDragOver = action((e: React.DragEvent<HTMLElement>) => {
    context.dropLocation = getDropLocation(e);
    if (context.dropLocation) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  const onDragEnter = action((e: React.DragEvent<HTMLElement>) => {
    context.dropLocation = getDropLocation(e);
    e.preventDefault();
    e.stopPropagation();
  });
  const onDrop = action((e: React.DragEvent<HTMLElement>) => {
    const dropLocation = getDropLocation(e);
    if (dropLocation?.handleDrop(e)) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  return (
    <TreeRowWrap
      ref={(e) => e && context.itemToDOM.set(item, e)}
      depth={depth}
      selected={item.selected}
      ancestorSelected={item.ancestorSelected}
      hovered={item.hovered}
      activeColor={item.activeColor ?? colors.active}
      activeTransparentColor={
        item.activeTransparentColor ?? colors.activeTransparent
      }
      onClick={onClick}
      draggable={!currentFocus.isTextInput}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {item.renderRowBackground()}
      {context.mode === "tree" && (
        <TreeCollapseButton
          visible={item.showsCollapseButton}
          collapsed={item.collapsed}
          onClick={onCollapseButtonClick}
        />
      )}
      <TreeRowContent>
        {item.renderRow({
          inverted: item.selected && context.invertedSelectionColor,
        })}
      </TreeRowContent>
    </TreeRowWrap>
  );
});

// Background

const BackgroudWrap = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`;

const Background = observer(function Background({
  context,
  rows,
}: {
  context: TreeViewContext;
  rows: ItemRow[];
}) {
  const getDropLocation = (e: React.DragEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const top = e.clientY - rect.top;

    if (top <= context.getHeaderBottom()) {
      return new DropLocation(context.rootItem, first(rows)?.item, {
        type: "bar",
        top: context.getHeaderBottom(),
        depth: 0,
      });
    }

    return context.getDropLocationBetween(rows, rows.length, getDropDepth(e));
  };

  const onDragEnter = action((e: React.DragEvent<HTMLElement>) => {
    context.dropLocation = getDropLocation(e);
    e.preventDefault();
    e.stopPropagation();
  });
  const onDragLeave = action((e: React.DragEvent<HTMLElement>) => {
    context.dropLocation = undefined;
    e.preventDefault();
    e.stopPropagation();
  });
  const onDragOver = action((e: React.DragEvent<HTMLElement>) => {
    context.dropLocation = getDropLocation(e);
    if (context.dropLocation.canDropData(e.dataTransfer)) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
  const onDrop = action((e: React.DragEvent<HTMLElement>) => {
    const dropLocation = getDropLocation(e);
    if (dropLocation.handleDrop(e)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  });
  const onContextMenu = action((e: React.MouseEvent) => {
    context.rootItem.handleContextMenu(e);
  });
  const onClick = action((e: React.MouseEvent) => {
    context.rootItem.deselect();
  });

  return (
    <BackgroudWrap
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onContextMenu={onContextMenu}
      onClick={onClick}
    />
  );
});

//// DropIndicator

const DropBetweenIndicator = styled.div`
  z-index: 50;

  --height: 2px;

  position: absolute;
  right: 0;
  top: calc(var(--top) - var(--height) / 2);
  height: var(--height);
  border-radius: 1px;
  background: ${colors.active};
  box-shadow: 0 0 0 1px ${colors.activeText};
  pointer-events: none;
`;

const DropOverIndicator = styled.div`
  z-index: 50;
  position: absolute;
  left: 0;
  right: 0;
  border: 1px solid ${colors.active};
  pointer-events: none;
`;

const DropIndicator: React.FC<{ context: TreeViewContext }> = observer(
  ({ context }) => {
    const indicator = context.dropLocation?.indicator;
    if (!indicator) {
      return <></>;
    }

    if (indicator.type === "bar") {
      const left =
        context.mode === "tree"
          ? indicator.depth * treeIndentation + treeCollapseButtonSize
          : 0;
      return (
        <DropBetweenIndicator
          style={{
            left: `${left}px`,
            // @ts-ignore
            ["--top"]: `${indicator.top}px`,
          }}
        />
      );
    } else {
      return (
        <DropOverIndicator
          style={{
            top: `${indicator.top}px`,
            height: `${indicator.height}px`,
          }}
        />
      );
    }
  }
);

//// TreeView

const TreeViewBody = styled.div<{ invertedSelectionColor: boolean }>`
  position: relative;

  ${TreeCollapseButton} {
    opacity: 0;
    transition: opacity 0.1s;
  }
  :hover ${TreeCollapseButton} {
    opacity: 1;
  }
`;

const TreeViewSimpleBar = styled(SimpleBar)`
  position: absolute;
  width: 100%;
  height: 100%;

  ${TreeViewBody} {
    width: 100%;
    overflow: hidden;
    min-height: 100%;
  }
`;

const HeaderWrap = styled.div``;

const TreeViewWrap = styled.div`
  position: relative;
`;

export interface TreeViewCommonProps {
  placeholder?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  invertsSelectionColor?: boolean;
  reorderable?: boolean;
  scroll?: boolean;
  className?: string;
  hidden?: boolean;
  style?: React.CSSProperties;
}

export interface TreeViewProps extends TreeViewCommonProps {
  rootItem?: TreeViewItem;
  mode?: "tree" | "list";
}

export const TreeView = observer(function TreeView({
  rootItem = new EmptyTreeViewItem(),
  mode = "tree",
  placeholder,
  header,
  footer,
  invertsSelectionColor = true,
  reorderable = true,
  scroll = true,
  className,
  hidden,
  style,
}: TreeViewProps) {
  const dragImageRef = createRef<HTMLDivElement>();

  const context = useMemo(
    () =>
      new TreeViewContext({
        rootItem,
        invertsSelectionColor,
        reorderable,
        mode,
      }),
    [rootItem]
  );

  const itemRows = context.getItemRows();

  useEffect(() => {
    context.dragImage = dragImageRef.current ?? undefined;
  }, [context, dragImageRef]);

  const body = (
    <TreeViewBody
      invertedSelectionColor={context.invertedSelectionColor}
      onMouseEnter={action(() => {
        context.treeViewHovered = true;
      })}
      onMouseMove={action(() => {
        context.dropLocation = undefined;
      })}
      onMouseLeave={action(() => {
        context.treeViewHovered = false;
      })}
    >
      <DragImage ref={dragImageRef} />
      <Background context={context} rows={itemRows} />
      {itemRows.length === 0 && placeholder}
      <HeaderWrap ref={(e) => (context.headerDOM = e ?? undefined)}>
        {header}
      </HeaderWrap>
      {itemRows.map((row, i) => (
        <TreeRow
          key={row.item.key}
          context={context}
          rows={itemRows}
          index={i}
        />
      ))}
      {footer}
      <DropIndicator context={context} />
    </TreeViewBody>
  );

  // TODO: use virtual scroll

  return (
    <TreeViewWrap className={className} hidden={hidden} style={style}>
      {scroll ? (
        <TreeViewSimpleBar forceVisible="y">{body}</TreeViewSimpleBar>
      ) : (
        body
      )}
    </TreeViewWrap>
  );
});

const DragImage = styled.div`
  position: fixed;
  left: -1000px;
  top: -1000px;
  width: 1px;
  height: 1px;
  visibility: hidden;
`;
