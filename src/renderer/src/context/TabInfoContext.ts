import { Tab } from "@renderer/model/tabs";
import { createContext } from "react";


type TabInfoContextType = {
  currentTab: Tab | null;
};

export const TabInfoContext = createContext<TabInfoContextType>({
  currentTab: null
});
