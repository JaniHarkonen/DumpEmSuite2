import { FlexibleTabs } from "@renderer/hook/useFlexibleTabs";
import TabManager from "@renderer/model/TabManager";
import { Tab } from "@renderer/model/view";
import { Context, createContext } from "react";

type GlobalContextSchema = {
  viewRef: React.MutableRefObject<Tab> | null;
  tabManager: TabManager;
  flexibleTabs: FlexibleTabs;
};

export const GlobalContext: Context<GlobalContextSchema> = createContext<GlobalContextSchema>({
  viewRef: null,
  tabManager: new TabManager(),
  flexibleTabs: {
    onDropTab: () => {},
    onSelectTab: () => {}
  }
});
