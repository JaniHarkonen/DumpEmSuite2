import { Section, Tab } from "@renderer/model/view";
import { useEffect, useState } from "react";

type UseFlexibleTabsProps = {
  rootTab: Tab;
};

type OnSelectTab = (parentSection: Section, selectedTab: Tab) => void;
type OnDropTab = (targetSection: Section) => void;

type TabSelection = {
  parentSection: Section;
  selectedTab: Tab;
} | null;

export type FlexibleTabs = {
  onSelectTab: OnSelectTab;
  onDropTab: OnDropTab;
};

export default function useFlexibleTabs(props: UseFlexibleTabsProps): FlexibleTabs {
  const pRootTab: Tab = props.rootTab;

  const [rootTab, setRootTab] = useState<Tab>(pRootTab);
  const [tabSelection, setTabSelection] = useState<TabSelection>(null);

  useEffect(() => {
    setRootTab(pRootTab);
  }, [pRootTab]);

  const onSelectTab: OnSelectTab = (parentSection: Section, selectedTab: Tab) => {
    if( !parentSection.hasTabs ) return;

    setTabSelection({
      parentSection,
      selectedTab
    });
  };

  const onDropTab: OnDropTab = (targetSection: Section) => {
    if( !tabSelection ) return;
    if( !targetSection.hasTabs ) return;

    const targetTabs: Tab[] = (targetSection.content as Tab[]);
    const selectionTabs: Tab[] = (tabSelection.parentSection!.content as Tab[]);
    //targetTabs.push(tabSelection.selectedTab);
    selectionTabs.splice(selectionTabs.indexOf(tabSelection.selectedTab));
    console.log(selectionTabs);
    //tabSelection.parentSection!.content = selectionTabs.splice(selectionTabs.indexOf(tabSelection.selectedTab));
    /*setRootTab({
      ...rootTab
    });
    setTabSelection(null);*/
  };

  return {
    onSelectTab,
    onDropTab
  };
}
