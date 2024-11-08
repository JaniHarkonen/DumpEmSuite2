import { ReactNode } from "react";


export interface TabBlueprint {
  id: string;
  workspace: string;
  caption: string;
}

export interface Tab extends TabBlueprint {
  content: ReactNode;
};

export interface TabContentProvider {
  getContent: (contentTemplate: string) => ReactNode;
}

export function buildTab(tabBlueprint: TabBlueprint, contentProvider: TabContentProvider): Tab {
  return {
    id: tabBlueprint.id,
    workspace: tabBlueprint.workspace,
    caption: tabBlueprint.caption,
    content: contentProvider.getContent(tabBlueprint.id)
  };
}

export function blueprintTab(tab: Tab): TabBlueprint {
  return {
    id: tab.id,
    workspace: tab.workspace,
    caption: tab.caption
  };
}
