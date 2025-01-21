import { TabsContext } from "@renderer/context/TabsContext";
import { Tab } from "@renderer/model/tabs";
import { Nullish } from "@renderer/utils/Nullish";
import { useContext } from "react";

type Returns = {
  formatKey: (baseKey: string) => string;
};

export default function useTabKeys(): Returns {
  const {tabs, activeTabIndex} = useContext(TabsContext);
  const activeTab: Tab | Nullish = tabs[activeTabIndex];

  const formatKey = (baseKey: string) => {
    return (activeTab ? activeTab.workspace + "-" + activeTab.id + "-" : "") + baseKey;
  };

  return { formatKey };
}
