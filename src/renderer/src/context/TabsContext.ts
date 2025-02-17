import { Tab } from "@renderer/model/tabs";
import { createContext } from "react";


export type OnSelect = (selectedTab: Tab) => void;
export type OnOpen = (openedTab: Tab) => void;
export type OnDrop = (index: number) => void;
export type SetExtraInfo = (extraInfo: any) => void;

export type TabsContextType = {
  tabs: Tab[];
  activeTabIndex: number;
  tabIndex: () => number;
  setExtraInfo: SetExtraInfo;
  onSelect?: OnSelect;
  onOpen?: OnOpen;
  onDrop?: OnDrop;
};

export const TabsContext = createContext<TabsContextType>({
  tabs: [],
  activeTabIndex: -1,
  tabIndex: () => -1,
  setExtraInfo: () => {}
});
