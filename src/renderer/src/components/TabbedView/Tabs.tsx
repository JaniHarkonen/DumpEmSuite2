import { ReactNode, useState } from "react";
import { TabSelection } from "./TabbedView2";

export type Tab = {
  id: string;
  workspace: string;
  caption: string;
  content: ReactNode;
};

export type TabSet = {
  [k: string]: Tab;
};

type OnSelect = (tab: Tab) => void;

type Props = {
  tabHeight: number;
  tabs: Tab[];
  activeTab: Tab | null;
  tabGroupIndex: number;
  onSelect?: OnSelect;
  onDrop?: Function;
  tabSelection?: TabSelection;
};

export default function Tabs(props: Props) {
  const pTabHeight: number = props.tabHeight;
  const pTabs: Tab[] = props.tabs;
  const pActiveTab: Tab | null = props.activeTab;
  const pOnSelect: OnSelect = props.onSelect || function() {};
  const pOnDrop: Function = props.onDrop || function() {};

  const [activeTab, setActiveTab] = useState<Tab | null>(pActiveTab);

  return (
    <div className="w-100 h-100 overflow-hidden">
      <div 
        className="w-100" 
        style={{ height: pTabHeight + "px" }}
        onMouseUp={() => pOnDrop()}
      >
        {pTabs.map((tab: Tab) => {
          return (
            <button
              key={tab.workspace + "-tab-button-" + tab.id}
              onMouseDown={() => pOnSelect(tab)}
              onClick={() => setActiveTab(tab)}
            >
              {tab.caption}
            </button>
          );
        })}
      </div>
      <div>
        {activeTab && activeTab.content}
      </div>
    </div>
  );
}
