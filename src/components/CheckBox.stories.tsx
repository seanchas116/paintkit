import React, { useState } from "react";
import { CheckBox, CheckBoxLabel, MultipleCheckBox } from "./CheckBox";

export default {
  title: "CheckBox",
  component: CheckBox,
};

export const Basic: React.FC = () => {
  const [value, setValue] = useState(false);

  return (
    <CheckBoxLabel>
      <CheckBox value={value} onChange={setValue} />
      Check Box
    </CheckBoxLabel>
  );
};

export const Multiple: React.FC = () => {
  const [values, setValues] = useState([false, true]);

  return (
    <CheckBoxLabel>
      <MultipleCheckBox
        values={values}
        onChange={(value) => setValues(value ? [true, true] : [false, false])}
      />
      Check Box
    </CheckBoxLabel>
  );
};
