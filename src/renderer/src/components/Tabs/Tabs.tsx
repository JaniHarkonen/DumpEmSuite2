import "./Tabs.css";
import { ReactNode } from "react";
import { Tab } from "@renderer/model/tabs";
import TabControls, { OnOpen, OnSelect } from "./TabControls/TabControls";
import useTabs from "@renderer/hook/useTabs";
import TabPanel from "./TabPanel/TabPanel";


type Props = {
  tabs: Tab[];
  activeTabIndex?: number;
  onSelect?: OnSelect;
  onOpen?: OnOpen;
};

export type TabsProps = Props;

export default function Tabs(props: Props): ReactNode {
  const pTabs: Tab[] = props.tabs;
  const pOnSelect: OnSelect = props.onSelect || function() {};
  const pOnOpen: OnOpen = props.onOpen || function() {};

  const {activeTab, setActiveTab} = useTabs({ activeTab: null });

  const handleOpenTab = (openedTab: Tab) => {
    setActiveTab(openedTab);
    pOnOpen(openedTab);
  };

  return (
    <div className="tabs-container">
      <TabControls
        tabs={pTabs}
        onSelect={(selectedTab: Tab) => pOnSelect(selectedTab)}
        onOpen={handleOpenTab}
      />
      {pTabs.map((tab: Tab) => {
        return (
          <TabPanel
            key={`tab-panel-ws-${tab.workspace}-id-${tab.id}`}
            isActive={activeTab === tab}
          >
            {tab.content}
          </TabPanel>
        );
      })}
    </div>
  );
}
