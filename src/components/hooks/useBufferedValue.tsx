import { isEqual } from "lodash-es";
import { useEffect } from "react";
import { useState } from "react";

/**
 * Buffers a value and change upstream value only when editing is finished
 * (e.g., Enter is pressed or input is blurred).
 * Use this for text/number inputs when you want the data to be updated only when you finish editing
 * (for performance reason or undo/redo.)
 *
 * @param value
 * @param onValueChange
 */
export function useBufferedValue<T>(
  value: T,
  onValueChange?: (value: T) => boolean,
  validate?: (value: T) => boolean
): [
  T /* value */,
  (value: T) => void /* onChange */,
  (value: T) => void /* onEditingFinish */
] {
  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => {
    setCurrentValue(value);
  }, [value, onValueChange]);

  return [
    currentValue,
    setCurrentValue,
    (newValue) => {
      setCurrentValue(newValue);
      if (!isEqual(newValue, value)) {
        try {
          if (validate && !validate(newValue)) {
            setCurrentValue(value);
            return;
          }

          if (!onValueChange?.(newValue)) {
            setCurrentValue(value);
          }
        } catch (e) {
          console.error(e);
          setCurrentValue(value);
        }
      }
    },
  ];
}
