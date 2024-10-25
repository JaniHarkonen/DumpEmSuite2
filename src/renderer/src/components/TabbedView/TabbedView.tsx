import "./TabbedView.css";

import { Tab } from "@renderer/model/view";
import { ReactNode, useEffect, useState } from "react";
import Divider from "../AdjustableGrid/Divider";
import { getView } from "@renderer/views/views.config";
import { CURRENT_APP_VERSION } from "@renderer/app.config";
import keyConstructor from "@renderer/utils/keyConstructor";

type OnTabMinimize = (isMinimized: boolean) => void;

type OnTabOpen = (wasOpen: boolean, tab: Tab) => void;

type TabbedViewProps = {
  view: Tab;
  tabHeight: number;
  allowMinimization?: boolean;
  onTabMinimize?: OnTabMinimize;
  onTabOpen?: OnTabOpen;
};

const keyTabButton = keyConstructor("tab-button");
const keyTabContent = keyConstructor("tab-content");
const keyTabMainContent = keyConstructor("tab-main");
const keyTabAlternateContent = keyConstructor("tab-alternate");

export default function TabbedView(props: TabbedViewProps): ReactNode {
  const pTabConfig: Tab = props.view;
  const pIsMinimized: boolean = pTabConfig.isMinimized || false;
  const pTabHeight: number = props.tabHeight;
  const pAllowMinimization: boolean = props.allowMinimization || false;
  const pOnTabMinimize: OnTabMinimize = props.onTabMinimize || function() {};
  const pOnTabOpen: OnTabOpen = props.onTabOpen || function() {};

  const [isMinimized, setMinimized] = useState<boolean>(pIsMinimized);
  const [activeTab, setActiveTab] = useState<Tab | null>(null);

  useEffect(() => {
    setMinimized(pIsMinimized);
  }, [pTabConfig.isMinimized]);

  const toggleMinimize = () => {
    const minimize = !isMinimized;
    setMinimized(minimize);
    pOnTabMinimize(minimize);
  };

  const handleOpenTab = (tab: Tab) => {
    const wasOpen: boolean = (tab === activeTab);
    setActiveTab(tab);
    pOnTabOpen(wasOpen, tab);
  };

  const renderTabs = (tabs: Tab[]): ReactNode[] => {
    return tabs.map((tab: Tab) => {
      return (
        <button 
          key={keyTabButton(pTabConfig.workspace, pTabConfig.id, tab.id)}
          className="tabbed-view-tab-button tabbed-view-tab-button-active"
          onClick={() => handleOpenTab(tab)}
          //onMouseDown={() => views.setSelection(tab) }
          //onMouseUp={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => e.stopPropagation()}
        >{tab.caption}
        </button>
      );
    });
  };

  const renderTabbedViewOrContent = (tab: Tab): ReactNode[] | ReactNode => {
    const contents: ReactNode[] = [];

    if( tab.tabs.length === 0 ) {
      if( tab.content.main ) {
        contents.push(getView(
          CURRENT_APP_VERSION, 
          tab.content.main, 
          keyTabMainContent(pTabConfig.workspace, pTabConfig.id, tab.id)
        ));
      }
      if( tab.content.alternate ) {
        contents.push(getView(
          CURRENT_APP_VERSION, 
          tab.content.alternate, 
          keyTabAlternateContent(pTabConfig.workspace, pTabConfig.id, tab.id)
        ));
      }
      return contents;
    }

    return (
      <TabbedView
        view={tab}
        tabHeight={24}
      />
    );
  };

  return (
    <div className="tabbed-view-container">
      <div
        className={"tabbed-view-tab-contaienr"}
        style={{height: pTabHeight}}
        //onMouseUp={() => pOnTabDrop(views.selection!)}
      >
        {renderTabs(pTabConfig.tabs)}
        {
          pAllowMinimization && (
            <button 
              className="tabbed-view-tab-button tabbed-view-tab-button-minimize"
              onClick={toggleMinimize}
            >
              {"_"}
            </button>
          )
        }
      </div>
      <div className="tabbed-view-content-container">
        {
          activeTab && (
            <Divider 
              key={keyTabContent(pTabConfig.workspace, pTabConfig.id, activeTab.id)}
              direction={activeTab.content.direction}
            >
              {renderTabbedViewOrContent(activeTab)}
            </Divider>
          )
        }
      </div>
    </div>
  );
}
