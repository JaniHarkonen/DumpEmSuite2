import { TabsContext } from "@renderer/context/TabsContext";
import { Tab } from "@renderer/model/tabs";
import { PropsWithChildren, ReactNode, useContext } from "react";


type Props = {
  // isActive: boolean;
  tab: Tab;
} & PropsWithChildren;

export default function TabPanel(props: Props): ReactNode {
  const pTab: Tab = props.tab;
  const pChildren: ReactNode = props.children;

  const {tabs, activeTabIndex} = useContext(TabsContext);

  const activeTab: Tab | null = tabs[activeTabIndex] || null;
  const isActive: boolean = (activeTab === pTab);

  
  return (
    <>
      {isActive && <>{pChildren}</>}
    </>
  );
}
