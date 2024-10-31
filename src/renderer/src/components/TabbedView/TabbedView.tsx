import "./TabbedView.css";

import { Section, Tab, TabSections } from "@renderer/model/view";
import { ReactNode, useContext, useEffect, useState } from "react";
import Divider from "../Divider/Divider";
import { AppViewTemplate, getView } from "@renderer/views/views.config";
import { CURRENT_APP_VERSION } from "@renderer/app.config";
import keyConstructor from "@renderer/utils/keyConstructor";
import { GlobalContext } from "@renderer/context/GlobalContext";

type TabbedViewProps = {
  parentSections: TabSections;
  sectionConfig: Section;
  tabConfig: Tab;
  tabHeight: number;
  allowMinimization?: boolean;
};

const keyTabButton = keyConstructor("tab-button");
const keyTabContent = keyConstructor("tab-content");
const keyTabMainContent = keyConstructor("tab-main");
const keyTabAlternateContent = keyConstructor("tab-alternate");

function constructContentOrTabbedView(
  tab: Tab, parentSections: TabSections, section: Section | undefined, key: string
): ReactNode {
  if( !section ) return undefined;

  if( !section.hasTabs ) {
    return getView(CURRENT_APP_VERSION, section.content as AppViewTemplate, key);
  }

  return (
    <TabbedView
      key={key}
      parentSections={parentSections}
      sectionConfig={section}
      tabConfig={tab}
      tabHeight={24}
    />
  );
}

export default function TabbedView(props: TabbedViewProps): ReactNode {
  const pSectionConfig: Section = props.sectionConfig;
  const pTabConfig: Tab = props.tabConfig;
  const pIsMinimized: boolean = pTabConfig.isMinimized || false;
  const pTabHeight: number = props.tabHeight;
  const pAllowMinimization: boolean = props.allowMinimization || false;

  const contentTabs: Tab[] = pSectionConfig.content as Tab[];

  const [availableTabs, setAvailableTabs] = useState<Tab[]>(contentTabs);
  const [isMinimized, setMinimized] = useState<boolean>(pIsMinimized);
  const [activeTab, setActiveTab] = useState<Tab | null>(null);

  const {tabManager} = useContext(GlobalContext);
  //const {flexibleTabs} = useContext(GlobalContext);

  useEffect(() => {
    setMinimized(pIsMinimized);
    //setAvailableTabs(contentTabs);
  }, [pTabConfig.isMinimized, contentTabs]);

  const toggleMinimize = () => {
    const minimize = !isMinimized;
    setMinimized(minimize);
  };

  const handleOpenTab = (tab: Tab) => {
    const wasOpen: boolean = (tab === activeTab);
    setActiveTab(tab);
  };

  /*const handleAddTab: TabMerger = (tab: Tab) => {
    setAvailableTabs(availableTabs.concat(tab));
  };

  const handleTabRemove: TabRemover = (tabIndex: number) => {
    const tab: Tab | undefined = availableTabs[tabIndex];

    if( !tab ) return;
    if (tab === activeTab) setActiveTab(null);

    setAvailableTabs(remove(availableTabs, tabIndex));
  };*/

  const handleTabSelection = (tabIndex: number) => {//(section: Section, tab: Tab) => {
    //flexibleTabs.onSelectTab(section, tab);
    tabManager.selectTab(contentTabs, tabIndex, (newTabs: Tab[]) => setAvailableTabs(newTabs));
  };

  const handleTabMerge = () => {
    //flexibleTabs.onDropTab(pSectionConfig);
    //tabManager.mergeTabs(availableTabs, handleAddTab);
    tabManager.mergeTabs(contentTabs, (newTabs: Tab[]) => setAvailableTabs(newTabs));
  };

  const handleTabSplit = () => {
    
  };

  const renderTabs = (tabs: Tab[]): ReactNode[] => {
    return tabs.map((tab: Tab, tabIndex: number) => {
      return (
        <button 
          key={keyTabButton(pTabConfig.workspace, pTabConfig.id, tab.id)}
          className="tabbed-view-tab-button tabbed-view-tab-button-active"
          onClick={() => handleOpenTab(tab)}
          onMouseDown={/*() => handleTabSelection(pSectionConfig, tab)*/() => handleTabSelection(tabIndex) }
          onMouseUp={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => e.stopPropagation()}
        >{tab.caption}
        </button>
      );
    });
  };

  const renderTabbedViewOrContent = (tab: Tab): ReactNode[] => {
    const contents: ReactNode[] = [];
    contents.push(constructContentOrTabbedView(
      tab, pTabConfig.sections, tab.sections.main, keyTabMainContent(pTabConfig.workspace, pTabConfig.id, tab.id))
    );
    contents.push(constructContentOrTabbedView(
      tab, pTabConfig.sections, tab.sections.alternate, keyTabAlternateContent(pTabConfig.workspace, pTabConfig.id, tab.id))
    );
    return contents;
  };

  return (
    <div className="tabbed-view-container">
      <div
        className={"tabbed-view-tab-container"}
        style={{height: pTabHeight}}
        onMouseUp={handleTabMerge}
      >
        {/*renderTabs(contentTabs)*/renderTabs(availableTabs)}
        {pAllowMinimization && (
          <button 
            className="tabbed-view-tab-button tabbed-view-tab-button-minimize"
            onClick={toggleMinimize}
          >
            {"_"}
          </button>
        )}
      </div>
      <div className="tabbed-view-content-container">
        {activeTab && (
          <Divider 
            key={keyTabContent(pTabConfig.workspace, pTabConfig.id, activeTab.id)}
            direction={activeTab.sections.direction}
          >
            {renderTabbedViewOrContent(activeTab)}
          </Divider>
        )}
      </div>
    </div>
  );
}
