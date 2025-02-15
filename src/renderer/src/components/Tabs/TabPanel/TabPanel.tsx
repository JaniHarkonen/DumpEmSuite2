import { TabsContext } from "@renderer/context/TabsContext";
import { Tab } from "@renderer/model/tabs";
import { PropsWithChildren, ReactNode, useContext } from "react";


type Props = {
  tab: Tab;
} & PropsWithChildren;

export default function TabPanel(props: Props): ReactNode {
  const pTab: Tab = props.tab;
  const pChildren: ReactNode = props.children;

  const {tabs, activeTabIndex, tabIndex} = useContext(TabsContext);

  const activeTab: Tab | null = tabs[activeTabIndex] || null;
  const isActive: boolean = (activeTab === pTab);

  if( isActive ) {
    return (
      <div
        className={"w-100 h-100 " + (activeTab?.workspace || "") + " " + (activeTab?.id || "")}
        tabIndex={tabIndex()}
      >
        {pChildren}
      </div>
    );
  } else {
    return <></>;
  }
}
