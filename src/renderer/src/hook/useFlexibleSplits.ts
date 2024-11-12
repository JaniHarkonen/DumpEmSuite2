import { DividerDirection, SplitBranch, SplitTree, SplitTreeBlueprint, SplitTreeFork, SplitTreeManager, SplitTreeValue } from "@renderer/model/splits";
import { Tab, TabContentProvider } from "@renderer/model/tabs";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";


export type TabSelection = {
  selectedTab: Tab;
  sourceFork: SplitTreeFork;
  sourceValueNode: SplitTreeValue;
} | null;

type Props = {
  splitTreeBlueprint: SplitTreeBlueprint | null | undefined;
  contentProvider: TabContentProvider;
};

export type UseFlexibleSplitsProps = Props;

type Returns = {
  splitTree: SplitTree | null;
  tabSelection: TabSelection;
  setTabSelection: Dispatch<SetStateAction<TabSelection>>;
  handleTabOpen: (targetNode: SplitTreeValue, tabIndex: number) => void;
  handleTabSelection: (selection: TabSelection) => void;
  handleTabRelocation: (toNode: SplitTreeValue) => void;
  handleTabSplit: (
    toFork: SplitTreeFork, 
    requestedDirection: DividerDirection, 
    requestedBranch: SplitBranch
  ) => void;
  handleDividerMove: (targetFork: SplitTreeFork, newValue: number) => void;
  handleTabAdd: (targetNode: SplitTreeValue, newTab: Tab) => void;
  handleTabRemove: (targetNode: SplitTreeValue, remove: Tab) => void;
};

export type UseFlexibleSplitsReturns = Returns;


export default function useFlexibleSplits(props: Props): Returns {
  const pSplitTreeBlueprint: SplitTreeBlueprint | null | undefined = props.splitTreeBlueprint;
  const pContentProvider: TabContentProvider = props.contentProvider;
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


  const ifSplitTreeExists = (callback: (prev: SplitTree | null) => SplitTree | null) => {
    setSplitTree((prev: SplitTree | null) => {
      if( !treeManager.current ) {
        return prev;
      }

      return callback(prev);
    });
  };

  const handleTabSelection = (selection: TabSelection) => {
    setTabSelection(selection);
  };

  const handleTabOpen = (targetNode: SplitTreeValue, tabIndex: number) => {
    ifSplitTreeExists(() => {
      const manager: SplitTreeManager = treeManager.current!;
      manager.openTab(targetNode, tabIndex);
      return manager.snapshot();
    });
  };

  const handleTabRelocation = (toNode: SplitTreeValue) => {
    ifSplitTreeExists((prev: SplitTree | null) => {
      if( !tabSelection ) {
        return prev;
      }

      const manager: SplitTreeManager = treeManager.current!;
      const successful: boolean = manager.relocateTab(
        tabSelection.sourceValueNode, toNode, tabSelection.selectedTab
      );

      if( !successful ) {
        return prev;
      }
      
      return manager.snapshot();
    });

    setTabSelection(null);
  };

  const handleTabSplit = (
    toFork: SplitTreeFork, 
    requestedDirection: DividerDirection, 
    requestedBranch: SplitBranch
  ) => {
    ifSplitTreeExists((prev: SplitTree | null) => {
      if( !tabSelection ) {
        return prev;
      }

      const manager: SplitTreeManager = treeManager.current!;
      const successful: boolean = manager.splitTab(
        tabSelection.sourceValueNode, 
        toFork, 
        requestedDirection, 
        requestedBranch, 
        tabSelection.selectedTab
      );

      if( !successful ) {
        return prev;
      }
      
      return manager.snapshot();
    });

    setTabSelection(null);
  };

  const handleDividerMove = (targetFork: SplitTreeFork, newValue: number) => {
    ifSplitTreeExists((prev: SplitTree | null) => {
      const manager: SplitTreeManager = treeManager.current!;
      const successful: boolean = manager.moveDivider(targetFork, newValue);

      if( !successful ) {
        return prev;
      }
      
      return manager.snapshot();
    });

    setTabSelection(null);
  };

  const handleTabAdd = (targetValue: SplitTreeValue, newTab: Tab) => {
    ifSplitTreeExists((prev: SplitTree | null) => {
      const manager: SplitTreeManager = treeManager.current!;
      const successful: boolean = manager.addTab(targetValue, newTab);

      if( !successful ) {
        return prev;
      }
      
      return manager.snapshot();
    });
  };

  const handleTabRemove = (targetValue: SplitTreeValue, remove: Tab) => {
    ifSplitTreeExists((prev: SplitTree | null) => {
      const manager: SplitTreeManager = treeManager.current!;
      const {wasSuccessful} = manager.removeTab(targetValue, remove);

      if( !wasSuccessful ) {
        return prev;
      }
      
      return manager.snapshot();
    });
  };


  return {
    splitTree,
    tabSelection,
    setTabSelection,
    handleTabOpen,
    handleTabSelection,
    handleTabRelocation,
    handleTabSplit,
    handleDividerMove,
    handleTabAdd,
    handleTabRemove
  };
}
