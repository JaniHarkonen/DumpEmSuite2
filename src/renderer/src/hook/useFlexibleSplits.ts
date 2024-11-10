import { DividerDirection, SplitBranch, SplitTree, SplitTreeFork, SplitTreeManager, SplitTreeValue } from "@renderer/model/splits";
import { Tab } from "@renderer/model/tabs";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";

export type TabSelection = {
  selectedTab: Tab;
  sourceFork: SplitTreeFork;
  sourceValueNode: SplitTreeValue;
} | null;

type Props = {
  splitTree: SplitTree;
};

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
};


export default function useFlexibleSplits(props: Props): Returns {
  const pSplitTree: SplitTree = props.splitTree;
  const [splitTree, setSplitTree] = useState<SplitTree | null>(null);
  const [tabSelection, setTabSelection] = useState<TabSelection>(null);
  const treeManager: MutableRefObject<SplitTreeManager | null> = useRef(null);

  useEffect(() => {
    treeManager.current = new SplitTreeManager(pSplitTree);
    setSplitTree(treeManager.current.snapshot());
  }, [pSplitTree]);

  const handleTabSelection = (selection: TabSelection) => {
    setTabSelection(selection);
  };

  const handleTabOpen = (targetNode: SplitTreeValue, tabIndex: number) => {
    setSplitTree((prev: SplitTree | null) => {
      if( !treeManager.current ) {
        return prev;
      }

      treeManager.current.openTab(targetNode, tabIndex);
      return treeManager.current.snapshot();
    });
  };

  const handleTabRelocation = (toNode: SplitTreeValue) => {
    setSplitTree((prev: SplitTree | null) => {
      if( !treeManager.current || !tabSelection ) {
        return prev;
      }

      const successful: boolean = treeManager.current.relocateTab(
        tabSelection.sourceValueNode, toNode, tabSelection.selectedTab
      );
      if( !successful ) {
        return prev;
      }
      
      return treeManager.current.snapshot();
    });

    setTabSelection(null);
  };

  const handleTabSplit = (
    toFork: SplitTreeFork, 
    requestedDirection: DividerDirection, 
    requestedBranch: SplitBranch
  ) => {
    setSplitTree((prev: SplitTree | null) => {
      if( !treeManager.current || !tabSelection ) {
        return prev;
      }

      const successful: boolean = treeManager.current.splitTab(
        tabSelection.sourceValueNode, 
        toFork, 
        requestedDirection, 
        requestedBranch, 
        tabSelection.selectedTab
      );
      if( !successful ) {
        return prev;
      }
      
      return treeManager.current.snapshot();
    });

    setTabSelection(null);
  };

  const handleDividerMove = (targetFork: SplitTreeFork, newValue: number) => {
    setSplitTree((prev: SplitTree | null) => {
      if( !treeManager.current ) {
        return prev;
      }

      const successful: boolean = treeManager.current.moveDivider(targetFork, newValue);
      if( !successful ) {
        return prev;
      }
      
      return treeManager.current.snapshot();
    });

    setTabSelection(null);
  };

  return {
    splitTree,
    tabSelection,
    setTabSelection,
    handleTabOpen,
    handleTabSelection,
    handleTabRelocation,
    handleTabSplit,
    handleDividerMove
  };
}
