import { ReactNode } from "react";


export interface TabBlueprint {
  id: string;
  workspace: string;
  caption: string;
  contentTemplate: string | null;
}

export interface Tab extends TabBlueprint {
  content: ReactNode;
}

export type TabSettingsBlueprint = {
  tabs: TabBlueprint[];
  activeTabIndex: number;
};

export type TabSettings = {
  tabs: Tab[];
  activeTabIndex: number;
};

export interface TabContentProvider {
  getContent: (contentTemplate: string | null) => ReactNode;
}

export function buildTab(tabBlueprint: TabBlueprint, contentProvider: TabContentProvider): Tab {
  return {
    id: tabBlueprint.id,
    workspace: tabBlueprint.workspace,
    caption: tabBlueprint.caption,
    contentTemplate: tabBlueprint.contentTemplate,
    content: contentProvider.getContent(tabBlueprint.contentTemplate)
  };
}

export function blueprintTab(tab: Tab): TabBlueprint {
  return {
    id: tab.id,
    workspace: tab.workspace,
    caption: tab.caption,
    contentTemplate: tab.contentTemplate
  };
}
