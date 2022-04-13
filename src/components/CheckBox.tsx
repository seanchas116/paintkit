import React, { useEffect } from "react";
import styled from "styled-components";
import checkIcon from "@iconify-icons/ic/outline-check";
import { iconToDataURL } from "@seanchas116/paintkit/src/util/Image";
import { colors } from "./Palette";
import { Label } from "./Label";

const checkIconURL = iconToDataURL(checkIcon);

export const CheckBoxLabel = styled(Label)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckBoxWrap = styled.input.attrs({ type: "checkbox" })`
  width: 12px;
  height: 12px;
  background: ${colors.uiBackground};
  border-radius: 4px;
  position: relative;

  :checked {
    ::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      mask-size: 12px;
      mask-image: url(${checkIconURL});
      mask-repeat: no-repeat;
      mask-position: center;
      background: white;
    }
    background: ${colors.active};
  }

  :indeterminate {
    ::before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 8px;
      height: 2px;
      border-radius: 1px;
      background: white;
    }
    background: ${colors.active};
  }

  :focus {
    border: 1px solid ${colors.active};
  }

  :not(:disabled) {
    cursor: pointer;
  }
`;

export const CheckBox: React.VFC<{
  value?: boolean;
  onChange?: (value: boolean) => void;
}> = ({ value, onChange }) => {
  return (
    <CheckBoxWrap
      checked={value}
      onChange={onChange && ((e) => onChange(e.currentTarget.checked))}
    />
  );
};

export const MultipleCheckBox: React.VFC<{
  values?: boolean[];
  onChange?: (value: boolean) => void;
}> = ({ values = [], onChange }) => {
  const ref = React.createRef<HTMLInputElement>();

  const someChecked = values.some((value) => value);
  const allChecked = values.every((value) => value);
  const indeterminate = someChecked && !allChecked;

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <CheckBoxWrap
      ref={ref}
      checked={someChecked}
      onChange={
        onChange &&
        ((e) =>
          indeterminate ? onChange(true) : onChange(e.currentTarget.checked))
      }
    />
  );
};
