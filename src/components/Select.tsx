import React, { createRef, ReactNode, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import scrollIntoView from "scroll-into-view-if-needed";
import { IconifyIcon } from "@iconify/types";
import { MIXED } from "../util/Mixed";
import { colors } from "./Palette";
import {
  popoverZIndex,
  textTruncate,
  downIconStyle,
  DropdownCheck,
  DropdownHeader,
  DropdownItem,
  inputStyle,
  PopoverBody,
} from "./Common";
import { RootPortal } from "./RootPortal";
import { InputIcon } from "./Input";

export interface SelectOption<T extends string = string> {
  key?: string | number;
  value: T;
  text?: string;
  icon?: JSX.Element;
}
export interface SelectSeparator {
  type: "separator";
}
export interface SelectHeader {
  type: "header";
  text: string;
}
export type SelectItem<T extends string = string> =
  | SelectOption<T>
  | SelectSeparator
  | SelectHeader;

export const SelectLabel = styled.div`
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
`;

export const SelectPlaceholder = styled(SelectLabel)`
  color: ${colors.disabledText};
`;

export const SelectButton = styled.button`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  text-align: left;

  ${inputStyle}
  ${textTruncate}

  &::after {
    content: "";
    pointer-events: none;
    margin-right: -2px;
    margin-left: auto;
    ${downIconStyle}
  }
`;

const SelectWrap = styled.div<{ disabled?: boolean }>`
  display: inline-block;
  height: 24px;
  min-width: 0;
  position: relative;

  &:focus ${SelectButton} {
    box-shadow: 0 0 0 1px inset ${colors.active};
  }

  ${SelectButton} {
    width: 100%;
    height: 100%;
  }

  ${(p) =>
    p.disabled &&
    css`
      pointer-events: none;
    `}
`;

const SelectPopoverBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
`;

const SelectPopoverScroll = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  visibility: hidden;
  z-index: ${popoverZIndex};

  ::-webkit-scrollbar {
    display: none;
  }
`;

const SelectPopoverBody = styled(PopoverBody)`
  display: inline-block;
  padding: 4px 0;
`;

const SelectPopoverFilterInput = styled.input`
  position: fixed;
  left: -1000px;
  top: -1000px;
`;

const SelectSeparator = styled.div`
  background: ${colors.uiBackground};
  height: 1px;
  margin: 4px 0;
`;

const SelectItemWrap = styled.div``;

class Filter {
  private resetInterval = 500;
  private charecters = "";
  private resetIntervalID = 0;

  clear() {
    this.charecters = "";
  }

  addCharacter(character: string) {
    this.charecters = this.charecters + character.toLowerCase();
    if (this.resetIntervalID) {
      window.clearInterval(this.resetIntervalID);
    }
    this.resetIntervalID = window.setInterval(
      () => this.clear(),
      this.resetInterval
    );
  }

  matches(text: string) {
    return text.toLowerCase().startsWith(this.charecters.toLowerCase());
  }
}

export interface SelectProps<T extends string> {
  className?: string;
  style?: React.CSSProperties;
  hidden?: boolean;
  tabIndex?: number;
  truncatesOptions?: boolean;
  disabled?: boolean;
  title?: string;
  icon?: IconifyIcon | string;

  options?: readonly SelectItem<T>[];
  value?: T | typeof MIXED;
  placeholder?: T;
  onChange?: (value: T, option: SelectOption<T>) => void;

  renderButton?: (open: () => void) => ReactNode;
  renderItem?: (
    option: SelectOption<T>,
    state: { selected: boolean; checked: boolean }
  ) => ReactNode;
}

function textOrValue(
  option: SelectOption<string> | undefined
): string | undefined {
  return option?.text ?? option?.value;
}

const selectItemWrapClassName = "macaron-select-item-wrap";

export function Select<T extends string>({
  className,
  style,
  hidden,
  tabIndex = 0,
  truncatesOptions,
  disabled,
  icon,
  title,
  options: optionsWithSeps = [],
  value,
  placeholder,
  onChange,
  renderButton,
  renderItem,
}: SelectProps<T>): JSX.Element {
  const options = optionsWithSeps.filter(
    (o): o is SelectOption<T> => "value" in o
  );

  const optionsWithSepsWithIndex: [number, SelectItem<T>][] = [];
  {
    let i = 0;
    for (const o of optionsWithSeps) {
      optionsWithSepsWithIndex.push([i, o]);
      if ("value" in o) {
        ++i;
      }
    }
  }

  const currentOption = options.find((o) => o.value === value);
  const valueText = textOrValue(currentOption);
  const placeholderText =
    value === MIXED
      ? "Mixed"
      : textOrValue(options.find((o) => o.value === placeholder)) ??
        placeholder;

  const [isOpen, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filter] = useState(() => new Filter());

  const resetSelectedIndex = () => {
    setSelectedIndex(options.findIndex((o) => o.value === value));
  };

  const open = () => {
    resetSelectedIndex();
    filter.clear();
    setOpen(true);
  };

  const close = () => {
    resetSelectedIndex();
    setOpen(false);
  };

  const selectFromFilter = () => {
    const index = options.findIndex((o) => filter.matches(o.value));
    if (0 <= index) {
      setSelectedIndex(index);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const body = bodyRef.current;
    if (body) {
      const item = body.querySelector(
        `.${selectItemWrapClassName}[data-index="${selectedIndex}"]`
      );
      if (item) {
        scrollIntoView(item, { scrollMode: "if-needed", block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const wrapRef = createRef<HTMLDivElement>();
  const scrollRef = createRef<HTMLDivElement>();
  const bodyRef = createRef<HTMLDivElement>();
  const filterInputRef = createRef<HTMLInputElement>();

  const toggleOpen = async () => {
    if (!isOpen) {
      return;
    }
    const wrap = wrapRef.current;
    const scroll = scrollRef.current;
    const body = bodyRef.current;
    if (!wrap || !scroll || !body) {
      return;
    }

    // Wait for getComputedStyle(body) to return correct value
    await new Promise((resolve) => setTimeout(resolve, 0));

    const wrapRect = wrap.getBoundingClientRect();

    const bodyComputedStyle = getComputedStyle(body);
    const bodyBorderTopWidth = Number.parseInt(
      bodyComputedStyle.borderTopWidth
    );
    const bodyPaddingTop = Number.parseInt(bodyComputedStyle.paddingTop);
    const bodyPaddingBottom = Number.parseInt(bodyComputedStyle.paddingBottom);
    const bodyBorderBottomWidth = Number.parseInt(
      bodyComputedStyle.borderBottomWidth
    );
    const bodyWidth = Number.parseInt(bodyComputedStyle.width);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const currentDOM = body.querySelector(
      `.${selectItemWrapClassName}[data-index="${selectedIndex}"]`
    ) as HTMLElement | null;
    const offset = currentDOM?.offsetTop ?? 0;

    const needsScroll =
      wrapRect.bottom - body.offsetHeight < 0 ||
      wrapRect.top + body.offsetHeight > window.innerHeight;

    if (truncatesOptions) {
      body.style.width = `${wrapRect.width}px`;
    } else {
      body.style.minWidth = `${wrapRect.width}px`;
    }

    if (truncatesOptions || wrapRect.left + bodyWidth <= window.innerWidth) {
      body.style.marginLeft = `${wrapRect.left}px`;
    } else {
      body.style.marginLeft = `${window.innerWidth - bodyWidth}px`;
    }

    if (needsScroll) {
      body.style.marginTop = `${
        wrapRect.top - bodyBorderTopWidth - bodyPaddingTop
      }px`;
      body.style.marginBottom = `${
        window.innerHeight -
        wrapRect.bottom -
        bodyBorderBottomWidth -
        bodyPaddingBottom
      }px`;

      scroll.style.overflowY = "scroll";
      scroll.scrollTop = offset - bodyBorderTopWidth - bodyPaddingTop;
    } else {
      body.style.marginTop = `${wrapRect.top - offset}px`;
      scroll.style.overflowY = "visible";
    }

    scroll.style.visibility = "visible";
    filterInputRef.current?.focus();
  };

  useEffect(() => {
    void toggleOpen();
  }, [isOpen]);

  const onFilterKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    if (e.key.length === 1) {
      filter.addCharacter(e.key.toLowerCase());
      selectFromFilter();
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        if (selectedIndex < options.length - 1) {
          setSelectedIndex(selectedIndex + 1);
        }
        break;
      case "ArrowUp":
        if (1 <= selectedIndex) {
          setSelectedIndex(selectedIndex - 1);
        }
        break;
      case "Enter":
        if (isOpen && 0 <= selectedIndex && selectedIndex < options.length) {
          const option = options[selectedIndex];
          onChange?.(option.value, option);
        }
        close();
        break;
      case "Escape":
        close();
        break;
      default:
        break;
    }
  };

  return (
    <SelectWrap
      ref={wrapRef}
      className={className}
      style={style}
      hidden={hidden}
      tabIndex={tabIndex}
      disabled={disabled}
    >
      {renderButton?.(open) ?? (
        <SelectButton
          onMouseDown={(e) => {
            if (e.button === 0) {
              open();
            }
          }}
        >
          {currentOption?.icon ||
            (icon && <InputIcon icon={icon} title={title} />)}
          <SelectLabel hidden={!valueText}>{valueText}</SelectLabel>
          <SelectPlaceholder hidden={!!(valueText || !placeholderText)}>
            {placeholderText}
          </SelectPlaceholder>
        </SelectButton>
      )}
      {isOpen && (
        <RootPortal>
          <SelectPopoverScroll ref={scrollRef}>
            <SelectPopoverBackground onClick={close} />
            <SelectPopoverFilterInput
              ref={filterInputRef}
              onKeyDown={onFilterKeyDown}
            />
            <SelectPopoverBody ref={bodyRef}>
              {optionsWithSepsWithIndex.map(([i, option], key) => {
                if ("type" in option) {
                  if (option.type === "separator") {
                    return <SelectSeparator key={key} />;
                  }
                  if (option.type === "header") {
                    return (
                      <DropdownHeader key={key}>{option.text}</DropdownHeader>
                    );
                  }
                }

                const selected = i === selectedIndex;
                const checked = value === option.value;
                return (
                  <SelectItemWrap
                    key={key}
                    className={selectItemWrapClassName}
                    data-index={i}
                    onMouseMove={() => {
                      setSelectedIndex(i);
                    }}
                    onClick={() => {
                      onChange?.(option.value, option);
                      close();
                    }}
                  >
                    {renderItem ? (
                      renderItem(option, { selected, checked })
                    ) : (
                      <DropdownItem selected={selected}>
                        <DropdownCheck visible={checked} />
                        {option.icon}
                        {textOrValue(option)}
                      </DropdownItem>
                    )}
                  </SelectItemWrap>
                );
              })}
            </SelectPopoverBody>
          </SelectPopoverScroll>
        </RootPortal>
      )}
    </SelectWrap>
  );
}
