import { SplitSide, SplitTree, SplitTreeFork, SplitTreeNode, SplitTreeValue } from "@renderer/model/splits";
import { Tab } from "@renderer/model/tabs";
import { ContentDirection } from "@renderer/model/view";
import { Dispatch, SetStateAction, useState } from "react";

export type TabSelection = {
  selectedTab: Tab;
  sourceSplit: SplitTreeFork;
  sourceSplitSide: SplitSide;
  parentSplit: SplitTreeFork | null;
  parentSplitSide: SplitSide | null;
} | null;


type Props = {
  splitTreeRoot: SplitTree;
};

type Comps = {
  splitTree: SplitTree;
  tabSelection: TabSelection;
  setTabSelection: Dispatch<SetStateAction<TabSelection>>;
  handleTabSelection: (selection: TabSelection) => void;
  handleTabRelocation: (targetSplit: SplitTreeFork, targetSplitSide: SplitSide) => void;
  handleTabSplit: (
    targetFork: SplitTreeFork, 
    requestedSide: SplitSide, 
    requestedDirection: ContentDirection
  ) => void;
};

export default function useFlexibleSplits(props: Props): Comps {
  const pSplitTreeRoot: SplitTree = props.splitTreeRoot;
  const [splitTree, setSplitTree] = useState<SplitTree>(pSplitTreeRoot);
  const [tabSelection, setTabSelection] = useState<TabSelection>(null);

  const handleTabSelection = (selection: TabSelection) => {
    setTabSelection(selection);
  };

  const handleTabRelocation = (targetSplit: SplitTreeFork, targetSplitSide: SplitSide) => {
    setSplitTree((prevTree: SplitTree) => {
        // No tab selected
      if( !tabSelection ) return prevTree;

      const {
        selectedTab, 
        sourceSplit, 
        sourceSplitSide, 
        parentSplit: sourceParentSplit, 
        parentSplitSide: sourceParentSplitSide
      } = tabSelection;
      const sourceNode: SplitTreeNode | null | undefined = sourceSplit[sourceSplitSide];

        // Attempting to relocate to the same tab (not a relocation)
      if( targetSplit === sourceSplit && sourceSplitSide === targetSplitSide ) return prevTree;

        // Invalid source node
      if( !sourceNode || sourceNode.isFork ) return prevTree;

      const sourceTabs: SplitTreeValue = sourceNode as SplitTreeValue;
      const sourceTabIndex = sourceTabs.value.indexOf(selectedTab);

        // Selected tab no longer exists in the source split
      if( sourceTabIndex < 0 ) return prevTree;

      const targetNode: SplitTreeNode | null | undefined = targetSplit[targetSplitSide];

        // Invalid target node
      if( !targetNode || targetNode.isFork ) return prevTree;

        // Relocate the tab
      const targetTabs: SplitTreeValue = targetNode as SplitTreeValue;
      targetTabs.value.push(selectedTab);
      sourceTabs.value.splice(sourceTabIndex, 1);

        // Consume split tree nodes
      if( sourceTabs.value.length === 0 ) {
        if( sourceParentSplitSide === "right" ) {
          sourceParentSplit!.left = (sourceParentSplit!.left as SplitTreeFork).left;
          sourceParentSplit!.right = (sourceParentSplit!.left as SplitTreeFork).right;
        } else if( sourceParentSplit?.right ) {
          sourceParentSplit!.left = (sourceParentSplit!.right as SplitTreeFork).left;
          sourceParentSplit!.right = (sourceParentSplit!.right as SplitTreeFork).right;
        } else {
          sourceParentSplit!.right = null;
        }
      }

      return {...prevTree};
    });
  };

  const handleTabSplit = (
    targetFork: SplitTreeFork, 
    requestedSide: SplitSide, 
    requestedDirection: ContentDirection
  ) => {
    setSplitTree((prevTree: SplitTree) => {
      
        // No tab selected
      if( !tabSelection ) return prevTree;

      const {
        selectedTab, 
        sourceSplit, 
        sourceSplitSide, 
        parentSplit: sourceParentSplit, 
        parentSplitSide: sourceParentSplitSide
      } = tabSelection;
      const sourceNode: SplitTreeNode | null | undefined = sourceSplit[sourceSplitSide];

        // Invalid source node
      if( !sourceNode || sourceNode.isFork ) return prevTree;
      const sourceTabs: SplitTreeValue = sourceNode as SplitTreeValue;
      const sourceTabIndex = sourceTabs.value.indexOf(selectedTab);

        // Selected tab no longer exists in the source split
      if( sourceTabIndex < 0 ) return prevTree;

      sourceTabs.value.splice(sourceTabIndex, 1);
      
        // Consume split tree nodes
      if( sourceTabs.value.length === 0 ) {
          // Consuming a fork leads to its nodes being copied to its parent fork.
          // Sometimes the consumed fork is the also the target fork -> check and 
          // change target fork here if necessary
        if( sourceParentSplit!.left === targetFork || sourceParentSplit!.right === targetFork ) {
          targetFork = sourceParentSplit as SplitTreeFork;
        }
        
        if( sourceParentSplitSide === "right" ) {
          sourceParentSplit!.left = (sourceParentSplit!.left as SplitTreeFork).left;
          sourceParentSplit!.right = (sourceParentSplit!.left as SplitTreeFork).right;
        } else if( sourceParentSplit?.right ) {
          sourceParentSplit!.left = (sourceParentSplit!.right as SplitTreeFork).left;
          sourceParentSplit!.right = (sourceParentSplit!.right as SplitTreeFork).right;
        } else {
          sourceParentSplit!.right = null;
        }
      }

        // Split the tab
      if( targetFork[requestedSide] ) {
        targetFork[(requestedSide === "left") ? "right" : "left"] = targetFork[requestedSide];
      }

      targetFork[requestedSide] = {
        isFork: false,
        side: requestedSide,
        value: [selectedTab]
      };

      targetFork.direction = requestedDirection;

        // Ensure that there is only one set of tabs per fork, split fork when left and right are full
        // (not null)
      targetFork.left = {
        isFork: true,
        side: "left",
        direction: "horizontal",
        left: {
          ...targetFork.left
        }
      };

      targetFork.right = {
        isFork: true,
        side: "right",
        direction: "horizontal",
        left: {
          ...targetFork.right!
        }
      };

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
