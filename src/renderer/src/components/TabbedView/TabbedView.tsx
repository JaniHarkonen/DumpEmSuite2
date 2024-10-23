import { GlobalContext } from "@renderer/context/GlobalContext";
import "./TabbedView.css";

import { ViewProps } from "@renderer/views";
import { useContext, useState } from "react";

export type TabbedViewTab = {
  id: string;
  caption: string;
  content?: JSX.Element;
};

type OnTabDrop = (tab: TabbedViewTab) => void;

type TabbedViewClassNames = {
  container?: string;
  tabContainer?: string;
  contentContainer?: string;
  button?: string;
  buttonActive?: string;
};

type TabbedViewProps = {
  height: number;
  tabs: TabbedViewTab[];
  classNames?: TabbedViewClassNames;
  onTabDrop?: OnTabDrop;
  allowMinimization?: boolean;
};

export function Tab(
  id: string, caption: string, Content: (props: ViewProps) => JSX.Element
): TabbedViewTab {
  return {
    id, caption, content: <Content key={id} parentID={id}/>
  };
}

const defaultClassNames: TabbedViewClassNames = {
  container: "tabbed-view-container",
  tabContainer: "tabbed-view-tab-container",
  contentContainer: "tabbed-view-content-container",
  button: "tabbed-view-tab-button",
  buttonActive: "tabbed-view-tab-button-active"
}

export default function TabbedView(props: TabbedViewProps): JSX.Element {
  const pHeight: number = props.height;
  const pTabs: TabbedViewTab[] = props.tabs || [];
  const pClassNames: TabbedViewClassNames = props.classNames || defaultClassNames;
  const pOnTabDrop: OnTabDrop = props.onTabDrop || function() {}
  const pAllowMinimization: boolean = props.allowMinimization || false;

  const {views} = useContext(GlobalContext);
  const [activeTab, setActiveTab] = useState<TabbedViewTab | null>(null);
  const [isTabClosed, setTabClosed] = useState<boolean>(true);

  const renderTabs = (tabs: TabbedViewTab[]): JSX.Element[] => {
    return tabs.map((tab: TabbedViewTab) => {
      return (
        <button 
          key={tab.id}
          className={
            (pClassNames.button || defaultClassNames.button) + " " +
            (tab === activeTab ? (pClassNames.buttonActive || defaultClassNames.buttonActive ) : "")
          }
          onClick={() => setActiveTab(tab)}
          onMouseDown={() => views.setSelection(tab) }
          onMouseUp={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => e.stopPropagation()}
        >{tab.caption}
        </button>
      );
    });
  };

  return (
    <div className={pClassNames.container || defaultClassNames.container}>
      <div
        className={pClassNames.tabContainer || defaultClassNames.tabContainer}
        style={{height: pHeight}}
        onMouseUp={() => pOnTabDrop(views.selection!)}
      >
        {renderTabs(pTabs)}
        {
          pAllowMinimization && (
            <button 
              className={
                (pClassNames.button || defaultClassNames.button) + 
                " tabbed-view-tab-button-minimize"
              }
              onClick={() => setTabClosed(!isTabClosed)}
            >{"_"}</button>
          )
        }
      </div>
      <div className={pClassNames.contentContainer}>
        {isTabClosed && (activeTab?.content || <></>)}
      </div>
    </div>
  );
}
