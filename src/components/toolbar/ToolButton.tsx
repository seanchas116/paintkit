import React from "react";
import styled from "styled-components";
import { action, computed, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import Tippy from "@tippyjs/react";
import keyboardArrowDownIcon from "@iconify-icons/ic/outline-keyboard-arrow-down";
import { IconifyIcon } from "@iconify/types";
import { Icon } from "@iconify/react/dist/offline";
import { iconToDataURL } from "../../util/Image";
import { colors } from "../Palette";
import { Command, Menu } from "../menu/Menu";
import { Dropdown } from "../menu/Dropdown";

const keyboardArrowDownIconURL = iconToDataURL(keyboardArrowDownIcon);

const DownArrow = styled.div`
  width: 12px;
  height: 100%;
  mask-size: 12px;
  mask-image: url(${keyboardArrowDownIconURL});
  mask-repeat: no-repeat;
  mask-position: center;
  background: currentColor;

  :hover {
    transform: translate(0, 2px);
  }
`;

const ToolButtonIcon = styled(Icon).attrs({ width: 20, height: 20 })`
  pointer-events: none;
`;

const ToolButtonWrap = styled.button`
  border: none;
  background: none;
  cursor: pointer;

  height: 24px;
  padding: 2px;
  border-radius: 4px;

  color: ${colors.icon};
  line-height: 12px;
  font-size: 11px;

  &[aria-pressed="true"] {
    background-color: ${colors.active} !important;
    color: ${colors.activeText};
  }

  &:disabled {
    color: ${colors.disabledText};
    cursor: not-allowed;
    ${DownArrow} {
      pointer-events: none;
    }
  }

  &:active ${ToolButtonIcon} {
      transform: scale(0.9);
    }
  }

  &:not(:disabled):hover {
    background-color: ${colors.uiBackground};
  }

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
`;

export const ToolButton: React.FC<{
  selected?: boolean;
  disabled?: boolean;
  label: string;
  icon?: IconifyIcon;
  downArrow?: boolean;
  onMouseDown?: (event: React.MouseEvent, toolButtonElement: Element) => void;
  onClick?: (event: React.MouseEvent, toolButtonElement: Element) => void;
  onDownArrowClick?: (
    event: React.MouseEvent,
    toolButtonElement: Element
  ) => void;
  onDownArrowMouseDown?: (
    event: React.MouseEvent,
    toolButtonElement: Element
  ) => void;
}> = ({
  selected,
  disabled,
  label,
  icon,
  downArrow,
  onMouseDown,
  onClick,
  onDownArrowClick,
  onDownArrowMouseDown,
}) => {
  const ref = React.createRef<HTMLButtonElement>();

  return (
    <Tippy content={label}>
      <ToolButtonWrap
        aria-pressed={selected}
        disabled={disabled}
        onMouseDown={(e) => onMouseDown?.(e, e.currentTarget)}
        onClick={(e) => onClick?.(e, e.currentTarget)}
        ref={ref}
      >
        <ToolButtonIcon icon={icon ?? ""} />
        {downArrow && (
          <DownArrow
            onMouseDown={
              onDownArrowMouseDown &&
              ((e) => {
                e.stopPropagation();
                if (ref.current) {
                  onDownArrowMouseDown(e, ref.current);
                }
              })
            }
            onClick={
              onDownArrowClick &&
              ((e) => {
                e.stopPropagation();
                if (ref.current) {
                  onDownArrowClick(e, ref.current);
                }
              })
            }
          />
        )}
      </ToolButtonWrap>
    </Tippy>
  );
};

export const CommandToolButton: React.FC<{
  command: Command;
  icon?: IconifyIcon;
}> = observer(({ command, icon }) => {
  const shortcut = command.shortcut?.[0];
  const label = shortcut
    ? `${command.title} (${shortcut.toText()})`
    : command.title;

  return (
    <ToolButton
      icon={icon ?? command.icon ?? undefined}
      selected={command.selected}
      disabled={command.disabled}
      label={label}
      onClick={() => command.run?.()}
    />
  );
});

export const ToolButtonArray = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const ToolButtonArrayGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export class DropdownCommands {
  constructor(commands: Command[]) {
    this.originalCommands = commands;
    this.current = commands[0];
    makeObservable(this);
  }

  private readonly originalCommands: Command[];

  @observable current: Command;

  @computed get commands(): Command[] {
    return this.originalCommands.map((c) => {
      return {
        title: c.title,
        icon: c.icon,
        disabled: c.disabled,
        selected: c.selected,
        shortcut: c.shortcut,
        run: action(() => {
          if (c.run?.()) {
            this.current = c;
            return true;
          }
          return false;
        }),
      };
    });
  }

  @computed get someSelected(): boolean {
    return this.originalCommands.some((c) => c.selected);
  }
}

export const DropdownCommandToolButton: React.FC<{
  commands: DropdownCommands;
}> = observer(({ commands }) => {
  const inputInsertModeSelected = commands.someSelected;
  const inputInsertToolCurrent = commands.current;

  return (
    <Dropdown
      options={commands.commands}
      button={(open, onClick) => (
        <ToolButton
          label={inputInsertToolCurrent?.title ?? ""}
          icon={inputInsertToolCurrent?.icon}
          downArrow
          selected={open || inputInsertModeSelected}
          onClick={() => {
            inputInsertToolCurrent.run?.();
          }}
          onDownArrowClick={(_, elem) => onClick(elem)}
        />
      )}
    />
  );
});

export const MeuToolButton: React.FC<{
  menu: Menu;
  icon?: IconifyIcon;
}> = observer(({ menu, icon }) => {
  const { disabled, title } = menu;

  return (
    <Dropdown
      options={menu.children}
      button={(open, onClick) => (
        <ToolButton
          downArrow
          disabled={disabled}
          icon={icon ?? menu.icon}
          label={title}
          selected={open}
          onDownArrowClick={(_, elem) => onClick(elem)}
          onClick={(_, elem) => onClick(elem)}
        />
      )}
    />
  );
});
