import { ReactNode } from "react";
import { blueprintNode, buildNode, defaultSplitTreeBlueprint, snapshotNode, SplitTree, SplitTreeBlueprint, SplitTreeFork, SplitTreeForkBlueprint } from "./splits";


export type SceneConfig = {
  splitTree: SplitTree;
};

export type SceneConfigBlueprint = {
  splitTree: SplitTreeBlueprint;
};

export interface TabBlueprint {
  id: string;
  workspace: string;
  caption: string;
  contentTemplate: string | null;
  tags: string[];
  sceneConfigBlueprint?: SceneConfigBlueprint;
  order: number;
}

export interface Tab extends Omit<TabBlueprint, "sceneConfigBlueprint"> {
  content: ReactNode;
  sceneConfig?: SceneConfig;
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
  getContent: (tabBlueprint: TabBlueprint) => ReactNode;
}

export function defaultSceneConfigBlueprint(): SceneConfigBlueprint {
  return {
    splitTree: {
      root: defaultSplitTreeBlueprint().root
    }
  };
}

export function buildTab(
  tabBlueprint: TabBlueprint, contentProvider: TabContentProvider
): Tab {
  let sceneConfig: SceneConfig | undefined = undefined;

  if( tabBlueprint.sceneConfigBlueprint ) {
    sceneConfig = {
      splitTree: {
        root: buildNode(
          tabBlueprint.sceneConfigBlueprint.splitTree.root, contentProvider
        ) as SplitTreeFork
      }
    };
  }
  
  return {
    id: tabBlueprint.id,
    workspace: tabBlueprint.workspace,
    caption: tabBlueprint.caption,
    contentTemplate: tabBlueprint.contentTemplate,
    content: contentProvider.getContent(tabBlueprint),
    tags: [...(tabBlueprint.tags || [])],
    sceneConfig,
    order: tabBlueprint.order
  };
}

export function blueprintTab(tab: Tab): TabBlueprint {
  let sceneConfigBlueprint: SceneConfigBlueprint | undefined = undefined;

  if( tab.sceneConfig ) {
    sceneConfigBlueprint = {
      splitTree: {
        root: blueprintNode(tab.sceneConfig.splitTree.root) as SplitTreeForkBlueprint
      }
    };
  }

  return {
    id: tab.id,
    workspace: tab.workspace,
    caption: tab.caption,
    contentTemplate: tab.contentTemplate,
    tags: [...(tab.tags || [])],
    sceneConfigBlueprint,
    order: tab.order
  };
}

export function copyTab(tab: Tab): Tab {
  let sceneConfig: SceneConfig | undefined = undefined;

  if( tab.sceneConfig ) {
    sceneConfig = {
      splitTree: {
        root: snapshotNode(tab.sceneConfig.splitTree.root) as SplitTreeFork
      }
    };
  }

  return {
    id: tab.id,
    workspace: tab.workspace,
    caption: tab.caption,
    contentTemplate: tab.contentTemplate,
    content: tab.content,
    tags: [...(tab.tags || [])],
    sceneConfig,
    order: tab.order
  };
}

export function tabEquals(tab1: Tab | TabBlueprint, tab2: Tab | TabBlueprint): boolean {
  return tab1.id === tab2.id && tab1.workspace === tab2.workspace;
}

export function indexOfTab(tabs: Tab[] | TabBlueprint[], tab: Tab | TabBlueprint): number {
  for( let i = 0; i < tabs.length; i++ ) {
    if( tabEquals(tabs[i], tab) ) {
      return i;
    }
  }
  return -1;
}
