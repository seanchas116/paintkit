import React, { useState } from "react";
import styled from "styled-components";
import { KeyValueEdit } from "./KeyValueEdit";

export default {
  component: KeyValueEdit,
};

const Wrap = styled.div`
  width: 256px;
`;

export const Basic: React.VFC = () => {
  const [map, setMap] = useState<Map<string, string>>(
    new Map([
      ["key1", "value1"],
      ["key2", "value2"],
      ["key3", "value3"],
    ])
  );
  const [selection, setSelection] = useState(new Set(["key1"]));

  return (
    <Wrap>
      <KeyValueEdit
        map={map}
        selection={selection}
        onChangeSelection={setSelection}
        onReorder={(newKeys) => {
          setMap(
            new Map(Array.from(newKeys).map((key) => [key, map.get(key) || ""]))
          );
        }}
        onChangeKey={(key, newKey) => {
          if (key === newKey) {
            return false;
          }
          if (map.has(newKey)) {
            return false;
          }
          setMap(
            new Map(
              Array.from(map).map(([k, v]) => [k === key ? newKey : k, v])
            )
          );
          return true;
        }}
        onChangeValue={(key, value) => {
          setMap(
            new Map(Array.from(map).map(([k, v]) => [k, k === key ? value : v]))
          );
          return true;
        }}
      />
    </Wrap>
  );
};
