import React, { useState } from "react";
import { InspectorTabBar, InspectorTabBarItem } from "./InspectorTabBar";

export default {
  component: InspectorTabBar,
  title: "InspectorTabBar",
};

const tabs = ["Tab 1", "Tab 2", "Tab 3"];

export const Basic: React.VFC = () => {
  const [index, setIndex] = useState(0);

  return (
    <InspectorTabBar>
      {tabs.map((tab, i) => (
        <InspectorTabBarItem
          aria-selected={i === index}
          onClick={() => setIndex(i)}
        >
          {tab}
        </InspectorTabBarItem>
      ))}
    </InspectorTabBar>
  );
};
