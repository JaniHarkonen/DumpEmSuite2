import { ViewProps } from "@renderer/views";
import "./TabbedView.css";
import { useState } from "react";

type TabbedViewProps = {
  height: number;
  tabs: TabbedViewTab[];
};

export type TabbedViewTab = {
  id: string;
  caption: string;
  content?: JSX.Element;
};


export function Tab(id: string, caption: string, Content: (props: ViewProps) => JSX.Element): TabbedViewTab {
  return {
    id, caption, content: <Content key={id} parentID={id}/>
  };
}

export default function TabbedView(props: TabbedViewProps): JSX.Element {
  const pHeight: number = props.height;
  const pTabs: TabbedViewTab[] = props.tabs || [];

  const [activeTab, setActiveTab] = useState<TabbedViewTab | null>(null);

  const renderTabs = (tabs: TabbedViewTab[]): React.ReactNode => {
    return tabs.map((tab: TabbedViewTab) => {
      return (
        <button 
          key={tab.id}
          onClick={() => setActiveTab(tab)}
        >{tab.caption}
        </button>
      );
    });
  };

  return (
    <div className="tabbed-view-container">
      <div
        className="tabbed-view-tab-container"
        style={{height: pHeight}}
      >
        {renderTabs(pTabs)}
      </div>
      <div>
        {activeTab?.content || <></>}
      </div>
    </div>
  );
}
