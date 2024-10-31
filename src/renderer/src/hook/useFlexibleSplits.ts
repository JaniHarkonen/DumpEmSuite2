import { addTab, ContentDirection, RemoveResult, removeTab, SplitSide, splitTab, SplitTree, SplitTreeFork } from "@renderer/model/splits";
import { Tab } from "@renderer/model/tabs";
import { Dispatch, SetStateAction, useState } from "react";

export type TabSelection = {
  selectedTab: Tab;
  sourceFork: SplitTreeFork;
  sourceSplitSide: SplitSide;
  parentFork: SplitTreeFork | null;
  parentSplitSide: SplitSide | null;
} | null;

type Props = {
  splitTreeRoot: SplitTree;
};

type Returns = {
  splitTree: SplitTree;
  tabSelection: TabSelection;
  setTabSelection: Dispatch<SetStateAction<TabSelection>>;
  handleTabSelection: (selection: TabSelection) => void;
  handleTabRelocation: (targetParentFork: SplitTreeFork, targetParentSide: SplitSide, targetSide: SplitSide) => void;
  handleTabSplit: (
    targetParentFork: SplitTreeFork,
    targetParentSide: SplitSide,
    targetSide: SplitSide,
    requestedSide: SplitSide, 
    requestedDirection: ContentDirection
  ) => void;
};

export default function useFlexibleSplits(props: Props): Returns {
  const pSplitTreeRoot: SplitTree = props.splitTreeRoot;
  const [splitTree, setSplitTree] = useState<SplitTree>(pSplitTreeRoot);
  const [tabSelection, setTabSelection] = useState<TabSelection>(null);

  const handleTabSelection = (selection: TabSelection) => {
    setTabSelection(selection);
  };

  const handleTabRelocation = (
    targetParentFork: SplitTreeFork, targetParentSide: SplitSide, targetSide: SplitSide
  ) => {
    setSplitTree((prevTree: SplitTree) => {
      if( !tabSelection ) return prevTree;

      const {
        selectedTab, 
        sourceSplitSide, 
        parentFork: sourceParentFork, 
        parentSplitSide: sourceParentSplitSide
      } = tabSelection;

      if( 
        !sourceParentFork || 
        !sourceParentSplitSide || 
        !sourceSplitSide || 
        !targetParentFork[targetParentSide] 
      ) return prevTree;
      
        // Attempting to relocate to the same tab (not a relocation)
      if( 
        sourceParentFork[sourceParentSplitSide]![sourceSplitSide] === 
        targetParentFork[targetParentSide][targetSide] 
      ) return prevTree;

        // Add tab to the target view
      addTab(
        targetParentFork[targetParentSide] as SplitTreeFork, 
        targetSide, selectedTab
      );

        // Remove tab from the source view
      removeTab(
        sourceParentFork, sourceParentSplitSide, sourceSplitSide, selectedTab
      );

      return {...prevTree};
    });

    setTabSelection(null);
  };

  const handleTabSplit = (
    targetParentFork: SplitTreeFork,
    targetParentSide: SplitSide,
    targetSide: SplitSide,
    requestedSide: SplitSide, 
    requestedDirection: ContentDirection
  ) => {
    setSplitTree((prevTree: SplitTree) => {
      if( !tabSelection ) return prevTree;

      const {
        selectedTab, 
        sourceSplitSide, 
        parentFork: sourceParentFork, 
        parentSplitSide: sourceParentSplitSide
      } = tabSelection;

      if( 
        !sourceParentFork || 
        !sourceParentSplitSide || 
        !sourceSplitSide ||
        !targetParentFork[targetParentSide] ||
        !targetParentFork[targetParentSide][targetSide]
      ) return prevTree;

        // Remove tab from the source view
      const targetFork: SplitTreeFork = targetParentFork[targetParentSide] as SplitTreeFork;
      const removeResult: RemoveResult = removeTab(
        sourceParentFork, 
        sourceParentSplitSide, 
        sourceSplitSide, 
        selectedTab, 
        targetFork
      );

      if( removeResult.failed ) return prevTree;

        // Split the target view and place the tab into the new view
      splitTab(
        removeResult.trackedFork!, requestedSide, requestedDirection, selectedTab
        //removeResult.trackedFork || targetFork, requestedSide, requestedDirection, selectedTab
      );

      return {...prevTree};
    });

    setTabSelection(null);
  };

  return {
    splitTree,
    tabSelection,
    setTabSelection,
    handleTabSelection,
    handleTabRelocation,
    handleTabSplit
  };
}
