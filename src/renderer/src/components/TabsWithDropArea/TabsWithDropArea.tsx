import "../Tabs/Tabs.css";
import "../DropArea/DropArea.css";
import TabControls, { OnOpen, OnSelect } from "../Tabs/TabControls/TabControls";
import { TabsProps } from "../Tabs/Tabs";
import { ReactNode } from "react";
import { Tab } from "@renderer/model/tabs";
import useTabs from "@renderer/hook/useTabs";
import TabPanel from "../Tabs/TabPanel/TabPanel";
import DropArea, { DropAreaSettings } from "../DropArea/DropArea";
import useDropAreas from "@renderer/hook/useDropAreas";


type OnContentDrop = (dropArea: DropAreaSettings) => void;
type OnTabDrop = () => void;

type Props = {
  dropAreas: DropAreaSettings[];
  isDropActive: boolean;
  onTabDrop?: OnTabDrop;
  onContentDrop?: OnContentDrop;
} & TabsProps;

export default function TabsWithDropArea(props: Props): ReactNode {
  const pTabs: Tab[] = props.tabs;
  const pActiveTabIndex: number = props.activeTabIndex ?? -1;
  const pOnSelect: OnSelect = props.onSelect || function() {};
  const pOnOpen: OnOpen = props.onOpen || function() {};
  const pDropAreas: DropAreaSettings[] = props.dropAreas;
  const pIsDropActive: boolean = props.isDropActive;
  const pOnTabDrop: OnTabDrop = props.onTabDrop || function() {};
  const pOnContentDrop: OnContentDrop = props.onContentDrop || function() {};

  const {activeTab, setActiveTab} = useTabs({ activeTab: pTabs[pActiveTabIndex] || null });
  const {
    handleDropAreaHighlight, 
    handleContentDrop, 
    setActiveDropArea, 
    activeDropArea
  } = useDropAreas({ dropAreas: pDropAreas, onDrop: pOnContentDrop });

  const handleOpenTab = (openedTab: Tab) => {
    setActiveTab(openedTab);
    pOnOpen(openedTab);
  };

  return (
    <div className="tabs-container">
      <TabControls
        tabs={pTabs}
        onSelect={pOnSelect}
        onOpen={handleOpenTab}
        onDrop={pOnTabDrop}
      />
      <div
        className="p-relative w-100 h-100"
        onMouseMove={handleDropAreaHighlight}
        onMouseUp={handleContentDrop}
        onMouseLeave={() => setActiveDropArea(null)}
      >
        {pTabs.map((tab: Tab) => {
          return (
            <TabPanel
              key={`drop-area-panel-ws-${tab.workspace}-id-${tab.id}`}
              isActive={activeTab === tab}
            >
              {tab.content}
            </TabPanel>
          );
        })}
        <div className="drop-area">
          {pIsDropActive && activeDropArea && (
            <DropArea highlight={activeDropArea.highlight} />
          )}
        </div>
      </div>
    </div>
  );
}
