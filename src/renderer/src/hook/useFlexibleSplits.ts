import { DividerDirection, SplitBranch, SplitTree, SplitTreeBlueprint, SplitTreeFork, SplitTreeManager, SplitTreeValue } from "@renderer/model/splits";
import { Tab, TabContentProvider } from "@renderer/model/tabs";
import { MutableRefObject, useEffect, useRef, useState } from "react";


export type TabSelection = {
  selectedTab: Tab;
  sourceFork: SplitTreeFork;
  sourceValueNode: SplitTreeValue;
} | null;

export type OnSplitsUpdate = (blueprint: SplitTreeBlueprint, newTree: SplitTree) => void;

type Props = {
  splitTreeBlueprint: SplitTreeBlueprint | null | undefined;
  contentProvider: TabContentProvider;
  onUpdate?: OnSplitsUpdate;
};

export type UseFlexibleSplitsProps = Props;

type Returns = {
  splitTree: SplitTree | null;
  tabSelection: TabSelection;
  handleTabOpen: (targetNode: SplitTreeValue, tabIndex: number) => void;
  handleTabSelection: (selection: TabSelection) => void;
  resetTabSelection: () => void;
  handleTabRelocation: (toNode: SplitTreeValue, index: number) => void;
  handleTabReorder: (targetNode: SplitTreeValue, index: number) => void;
  handleTabCaptionChange: (targetNode: SplitTreeValue, targetTab: Tab, caption: string) => void;
  handleTabSplit: (
    toFork: SplitTreeFork, 
    requestedDirection: DividerDirection, 
    requestedBranch: SplitBranch
  ) => void;
  handleDividerMove: (targetFork: SplitTreeFork, newValue: number) => void;
  handleTabAdd: (targetNode: SplitTreeValue, newTab: Tab, index?: number) => void;
  handleTabRemove: (targetNode: SplitTreeValue, remove: Tab) => void;
  handleExtraInfo: (targetValue: SplitTreeValue, targetTab: Tab, extraInfo: any) => void;
};

export type UseFlexibleSplitsReturns = Returns;


export default function useFlexibleSplits(props: Props): Returns {
  const pSplitTreeBlueprint: SplitTreeBlueprint | null | undefined = props.splitTreeBlueprint;
  const pContentProvider: TabContentProvider = props.contentProvider;
  const pOnSplitsUpdate: OnSplitsUpdate = props.onUpdate || function () {};

  const [splitTree, setSplitTree] = useState<SplitTree | null>(null);
  const [tabSelection, setTabSelection] = useState<TabSelection>(null);
  
  const treeManager: MutableRefObject<SplitTreeManager | null> = useRef(null);

  useEffect(() => {
    if( pSplitTreeBlueprint ) {
      const builtTree: SplitTree | null = 
        SplitTreeManager.buildTree(pSplitTreeBlueprint, pContentProvider);
        
      if( builtTree ) {
        treeManager.current = new SplitTreeManager(builtTree);
        setSplitTree(treeManager.current.snapshot());
      }
    }
  }, [pSplitTreeBlueprint]);


  const handleSplitsUpdate = (modifier: (manager: SplitTreeManager) => boolean) => {
    setSplitTree((prev: SplitTree | null) => {
      const manager: SplitTreeManager | null = treeManager.current;

      if( !manager ) {
        return prev;
      }

      const wasSuccessful: boolean = modifier(manager);

      if( !wasSuccessful ) {
        return prev;
      }

      const newTree: SplitTree = manager.snapshot();
      pOnSplitsUpdate(manager.blueprint(), newTree);
      return newTree;
    });

    setTabSelection(null);
  };

  const handleTabSelection = (selection: TabSelection) => {
    setTabSelection(selection);
  };

  const resetTabSelection = () => setTabSelection(null);

  const handleTabOpen = (targetNode: SplitTreeValue, tabIndex: number) => {
    handleSplitsUpdate((manager: SplitTreeManager): boolean => {
      manager.openTab(targetNode, tabIndex);
      return true;
    });
  };

  const handleTabRelocation = (toNode: SplitTreeValue) => {
    handleSplitsUpdate((manager: SplitTreeManager): boolean => {
      if( !tabSelection ) {
        return false;
      }

      return manager.relocateTab(
        tabSelection.sourceValueNode, toNode, tabSelection.selectedTab
      );
    });
  };

  const handleTabReorder = (targetNode: SplitTreeValue, index: number) => {
    handleSplitsUpdate((manager: SplitTreeManager): boolean => {
      if( !tabSelection ) {
        return false;
      }

      return manager.reorderTab(targetNode, tabSelection.selectedTab, index);
    });
  };

  const handleTabCaptionChange = (targetNode: SplitTreeValue, targetTab: Tab, caption: string) => {
    handleSplitsUpdate((manager: SplitTreeManager): boolean => {
      return manager.changeTabCaption(targetNode, targetTab, caption);
    });
  };

  const handleTabSplit = (
    toFork: SplitTreeFork, 
    requestedDirection: DividerDirection, 
    requestedBranch: SplitBranch
  ) => {
    handleSplitsUpdate((manager: SplitTreeManager): boolean => {
      return !!tabSelection && manager.splitTab(
        tabSelection.sourceValueNode, 
        toFork, 
        requestedDirection, 
        requestedBranch, 
        tabSelection.selectedTab
      );
    });
  };

  const handleDividerMove = (targetFork: SplitTreeFork, newValue: number) => {
    handleSplitsUpdate((manager: SplitTreeManager): boolean => {
      return manager.moveDivider(targetFork, newValue);
    });
  };

  const handleTabAdd = (targetValue: SplitTreeValue, newTab: Tab, index: number = Infinity) => {
    handleSplitsUpdate((manager: SplitTreeManager): boolean => {
      return manager.addTab(targetValue, newTab, index);
    });
  };

  const handleTabRemove = (targetValue: SplitTreeValue, remove: Tab) => {
    handleSplitsUpdate((manager: SplitTreeManager): boolean => {
      return manager.removeTab(targetValue, remove).wasSuccessful;
    });
  };

  const handleExtraInfo = (targetValue: SplitTreeValue, targetTab: Tab, extraInfo: any) => {
    handleSplitsUpdate((manager: SplitTreeManager): boolean => {
      return manager.setTabExtraInfo(targetValue, targetTab, {
        ...targetTab.extra,
        ...extraInfo
      });
    });
  };

  return {
    splitTree,
    tabSelection,
    resetTabSelection,
    handleTabOpen,
    handleTabSelection,
    handleTabRelocation,
    handleTabReorder,
    handleTabCaptionChange,
    handleTabSplit,
    handleDividerMove,
    handleTabAdd,
    handleTabRemove,
    handleExtraInfo
  };
}
