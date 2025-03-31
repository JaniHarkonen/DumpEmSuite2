import { SetExtraInfo, TabsContext } from "@renderer/context/TabsContext";
import { Tab } from "@renderer/model/tabs";
import { useContext } from "react";


type Returns = {
  extraInfo?: any;
  setExtraInfo?: SetExtraInfo;
}

export default function useExtraInfo(): Returns {
  const {tabs, activeTabIndex, setExtraInfo} = useContext(TabsContext);
  const activeTab: Tab | undefined = tabs[activeTabIndex];
  const extraInfo: any | undefined = activeTab?.extra;

  return {
    extraInfo,
    setExtraInfo
  };
}
