import React, { createRef, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import keyboardArrowRightIcon from "@iconify-icons/ic/outline-keyboard-arrow-right";
import checkIcon from "@iconify-icons/ic/outline-check";
import { Icon } from "@iconify/react/dist/offline";
import { colors } from "../Palette";
import { popoverStyle, popoverZIndex } from "../Common";
import { iconToDataURL } from "../../util/Image";
import { Command, Menu, MenuItem } from "./Menu";

const keyboardArrowRightIconURL = iconToDataURL(keyboardArrowRightIcon);

function currentIndex(indexPath: readonly number[], depth: number) {
  if (0 <= depth && depth < indexPath.length) {
    return indexPath[depth];
  }
  return -1;
}

function setCurrentIndex(
  indexPath: readonly number[],
  depth: number,
  index: number
): number[] {
  const newPath = indexPath.slice(0, depth);
  newPath[depth] = index;
  return newPath;
}

const Background = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
`;

export const MenuBar: React.FC<{
  className?: string;
  menu: readonly Menu[];
  indexPath: readonly number[];
  onChangeIndexPath: (path: number[]) => void;
}> = ({ className, menu, indexPath, onChangeIndexPath }) => {
  return (
    <MenuBarWrap className={className}>
      {currentIndex(indexPath, 0) >= 0 && (
        <Background
          onClick={() => {
            onChangeIndexPath([]);
          }}
        />
      )}
      {menu.map((menu, i) => {
        return (
          <MenuBarItem key={i}>
            <MenuBarLabel
              current={i === currentIndex(indexPath, 0)}
              onClick={() => {
                if (currentIndex(indexPath, 0) >= 0) {
                  onChangeIndexPath([]);
                } else {
                  onChangeIndexPath([i]);
                }
              }}
              onMouseEnter={() => {
                if (currentIndex(indexPath, 0) >= 0) {
                  onChangeIndexPath([i]);
                }
              }}
            >
              {menu.text}
            </MenuBarLabel>
            {currentIndex(indexPath, 0) === i ? (
              <MenuList
                menu={menu}
                indexPath={indexPath}
                depth={1}
                onChangeIndexPath={onChangeIndexPath}
              />
            ) : (
              <></>
            )}
          </MenuBarItem>
        );
      })}
    </MenuBarWrap>
  );
};

export const MenuList: React.FC<{
  menu: MenuItem;
  indexPath: readonly number[];
  depth: number;
  onChangeIndexPath: (path: number[]) => void;
}> = ({ menu, indexPath, depth, onChangeIndexPath }) => {
  const children = ("children" in menu && menu.children) || [];
  return (
    <MenuListWrap>
      {children.map((child, i) =>
        "type" in child ? (
          <Separator key={i} />
        ) : "role" in child ? (
          <></> // not supported
        ) : (
          <MenuRow
            key={i}
            item={child}
            indexPath={indexPath}
            depth={depth}
            index={i}
            onChangeIndexPath={onChangeIndexPath}
          />
        )
      )}
    </MenuListWrap>
  );
};

const MenuRow: React.FC<{
  item: Command | Menu;
  indexPath: readonly number[];
  depth: number;
  index: number;
  onChangeIndexPath: (path: number[]) => void;
}> = ({ item, indexPath, depth, index, onChangeIndexPath }) => {
  const isCurrent = currentIndex(indexPath, depth) === index;

  const [submenuDirection, setSubmenuDirection] = useState<"left" | "right">(
    "right"
  );
  const ref = createRef<HTMLDivElement>();
  const submenuRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (ref.current && submenuRef.current && isCurrent) {
      const rowRect = ref.current.getBoundingClientRect();
      const submenuRect = submenuRef.current.getBoundingClientRect();

      if (window.innerWidth - rowRect.right < submenuRect.width) {
        setSubmenuDirection("left");
      } else {
        setSubmenuDirection("right");
      }
    }
  });

  if ("children" in item) {
    return (
      <MenuRowWrap ref={ref}>
        <MenuRowContent
          onMouseEnter={() => {
            onChangeIndexPath(setCurrentIndex(indexPath, depth, index));
          }}
          current={isCurrent}
          disabled={item.disabled}
        >
          {item.icon && <MenuRowIcon icon={item.icon} />}
          <MenuRowLabel>{item.text}</MenuRowLabel>
          <MenuRowArrow />
        </MenuRowContent>
        {isCurrent && (
          <MenuRowSubMenu ref={submenuRef} direction={submenuDirection}>
            <MenuList
              menu={item}
              indexPath={indexPath}
              depth={depth + 1}
              onChangeIndexPath={onChangeIndexPath}
            />
          </MenuRowSubMenu>
        )}
      </MenuRowWrap>
    );
  } else {
    const accelerator = item.shortcut?.[0].toText();

    return (
      <MenuRowWrap>
        <MenuRowContent
          onClick={() => {
            if (item.disabled) {
              return;
            }
            onChangeIndexPath([]);
            item.run?.();
          }}
          onMouseEnter={() => {
            onChangeIndexPath(setCurrentIndex(indexPath, depth, index));
          }}
          current={isCurrent}
          disabled={item.disabled}
          hasCheck={item.selected !== undefined}
        >
          {item.selected !== undefined &&
            (item.selected ? <MenuRowCheck /> : <MenuRowNoCheck />)}
          {item.icon && <MenuRowIcon icon={item.icon} />}
          <MenuRowLabel>{item.text}</MenuRowLabel>
          {accelerator && <MenuRowShortcut>{accelerator}</MenuRowShortcut>}
        </MenuRowContent>
      </MenuRowWrap>
    );
  }
};

const MenuRowIcon = styled(Icon).attrs({ width: 16, height: 16 })`
  color: ${colors.icon};
`;

const MenuRowCheck = styled(Icon).attrs({
  width: 12,
  height: 12,
  icon: checkIcon,
})``;

const MenuRowNoCheck = styled.div`
  width: 12px;
  height: 12px;
  flex: 0 0 auto;
`;

const MenuRowLabel = styled.div`
  color: ${colors.text};
  flex: 1;
`;

const MenuRowShortcut = styled.div`
  color: ${colors.disabledText};
  margin-left: 8px;
`;
const MenuRowArrow = styled.div`
  width: 12px;
  height: 12px;
  margin-right: -4px;
  color: ${colors.icon};
  background-color: currentColor;
  mask-size: 12px;
  mask-image: url(${keyboardArrowRightIconURL});
`;
const MenuRowSubMenu = styled.div<{ direction: "left" | "right" }>`
  position: absolute;
  top: -5px;
  ${(p) =>
    p.direction === "left"
      ? css`
          right: 100%;
        `
      : css`
          left: 100%;
        `}
`;

const MenuRowContent = styled.div<{
  current?: boolean;
  disabled?: boolean;
  hasCheck?: boolean;
}>`
  white-space: nowrap;
  height: 22px;
  font-size: 12px;
  line-height: 22px;
  padding: 0 16px;
  display: flex;
  gap: 4px;
  align-items: center;

  ${(p) =>
    p.disabled &&
    css`
      ${MenuRowLabel} {
        color: ${colors.disabledText};
      }
    `}

  ${(p) =>
    p.current &&
    css`
      background-color: ${colors.active};
      &,
      * {
        color: ${colors.activeText};
      }
    `}

    ${(p) =>
    p.hasCheck &&
    css`
      padding-left: 8px;
    `}
`;

const MenuRowWrap = styled.div`
  position: relative;
`;

const Separator = styled.div`
  height: 1px;
  margin: 4px 0;
  background-color: ${colors.uiBackground};
`;

const MenuListWrap = styled.div`
  padding: 4px 0;
  ${popoverStyle}
  overflow: visible;
`;

const MenuBarLabel = styled.div<{ current: boolean }>`
  padding: 0 8px;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  color: ${colors.text};

  :hover {
    background: ${colors.active};
    color: ${colors.activeText};
  }
  ${(p) =>
    p.current &&
    css`
      background-color: ${colors.active};
      color: ${colors.activeText};
    `}
`;

const MenuBarItem = styled.div`
  position: relative;

  > ${MenuListWrap} {
    position: absolute;
    top: 28px;
    left: 0;
  }
`;

const MenuBarWrap = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
  * {
    -webkit-app-region: no-drag;
  }
  z-index: ${popoverZIndex};
`;
