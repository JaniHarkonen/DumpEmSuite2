import { Tab } from "@renderer/model/tabs";
import { createContext } from "react";


export type OnSelect = (selectedTab: Tab) => void;
export type OnOpen = (openedTab: Tab) => void;
export type OnDrop = (index: number) => void;
export type SetExtraInfo = (extraInfo: any) => void;

export type TabsContextType = {
  tabs: Tab[];
  activeTabIndex: number;
  onSelect?: OnSelect;
  onOpen?: OnOpen;
  onDrop?: OnDrop;
  setExtraInfo?: SetExtraInfo;
};

export const TabsContext = createContext<TabsContextType>({
  tabs: [],
  activeTabIndex: -1
});
