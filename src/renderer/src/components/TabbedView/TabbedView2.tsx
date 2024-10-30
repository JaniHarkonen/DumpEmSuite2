import { ReactNode, useState } from "react";
import Tabs, { Tab } from "./Tabs";
import Divider from "../Divider/Divider";
import { ContentDirection } from "@renderer/model/view";


type Props = {
  //views: View[]
};

export type SplitSide = "left" | "right";

type TabSelection = {
  selectedTab: Tab;
  sourceSplit: SplitTreeFork;
  sourceSplitSide: SplitSide;
  parentSplit: SplitTreeFork | null;
  parentSplitSide: SplitSide | null;
} | null;

interface SplitTreeItem {
  isFork: boolean;
  side: SplitSide | null;
}

type SplitTreeNode = SplitTreeFork | SplitTreeValue;

interface SplitTreeFork extends SplitTreeItem {
  direction: ContentDirection;
  left: SplitTreeNode;
  right?: SplitTreeNode | null;
}

interface SplitTreeValue extends SplitTreeItem {
  value: Tab[];
}

type SplitTree = {
  root: SplitTreeNode;
};

const testSplitTree: SplitTree = {
  root: {
    isFork: true,
    side: null,
    direction: "horizontal",
    left: {
      isFork: true,
      side: null,
      direction: "horizontal",
      left: {
        isFork: false,
        side: "left",
        value: [
          {id: "left-side", workspace: "test", caption: "Left side", content: <>left side works</>},
          {id: "another-test", workspace: "test", caption: "Another Test", content: <>another test.... works</>},
          {id: "new-test", workspace: "test", caption: "New Test", content: <>new test works</>},
          {id: "third-test", workspace: "test", caption: "third Test", content: <>third test here</>},
        ]
      }
    }
  }
};

export default function TabbedView(props: Props): ReactNode {
  const [splitTree, setSplitTree] = useState<SplitTree>(testSplitTree);
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
        if( sourceSplitSide === "right" ) { // If right is empty, consume
          sourceSplit[sourceSplitSide] = null;
        } else if( sourceSplit.right ) { // If left is empty, move right to left, consume right
          sourceSplit[sourceSplitSide] = sourceSplit.right;
          sourceSplit.right = null;
        } else {
            // If left and right are empty, consume node
          if( sourceParentSplitSide === "left" ) {
            sourceParentSplit!.left = sourceParentSplit!.right!;
            sourceParentSplit!.left.side = "left";
          } else {
            sourceParentSplit!.right = null;
          }
        }
      }

      return {...prevTree};
    });
  };

  //const handleTabSplit = (targetFork: SplitTreeFork, targetNodeSplitSide: SplitSide, targetSide: SplitSide, direction: ContentDirection) => {
  const handleTabSplit = (targetFork: SplitTreeFork, requestedSide: SplitSide, requestedDirection: ContentDirection) => {
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
        if( sourceSplitSide === "right" ) { // If right is empty, consume
          sourceSplit[sourceSplitSide] = null;
        } else if( sourceSplit.right ) { // If left is empty, move right to left, consume right
          sourceSplit[sourceSplitSide] = sourceSplit.right;
          sourceSplit.right = null;
        } else {
            // If left and right are empty, consume node
          if( sourceParentSplitSide === "left" ) {
            sourceParentSplit!.left = sourceParentSplit!.right!;
            sourceParentSplit!.left.side = "left";
          } else {
            sourceParentSplit!.right = null;
          }
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

  const renderSplits = (
    root: SplitTreeNode, 
    parent: SplitTreeFork | null, 
    splitSide: SplitSide, 
    greatParent: SplitTreeFork | null, 
    greatParentSide: SplitSide | null
  ): ReactNode => {
    const valueNode: SplitTreeValue = root as SplitTreeValue;
    if( !root.isFork ) {
      return (
        <Tabs
          tabHeight={24}
          tabs={valueNode.value}
          activeTab={null}
          onSelect={(tab: Tab) => handleTabSelection({
            selectedTab: tab, 
            sourceSplit: parent!, 
            sourceSplitSide: splitSide,
            parentSplit: greatParent,
            parentSplitSide: greatParentSide
          })}
          onDrop={() => handleTabRelocation(parent!, splitSide)}
          onSplit={(requestedDirection: ContentDirection, requestedSide: SplitSide) => handleTabSplit(parent!, requestedSide, requestedDirection)}
          isTabDragging={!!tabSelection}
        />
      );
    }

    const fork: SplitTreeFork = root as SplitTreeFork;
    return (
      <Divider direction={fork.direction}>
        {renderSplits(fork.left, fork, "left", parent, splitSide)}
        {fork.right && renderSplits(fork.right, fork, "right", parent, splitSide)}
      </Divider>
    );
  };

  return (
    <div className="w-100 h-100 overflow-hidden">
      {renderSplits(splitTree.root, null, "left", null, null)}
    </div>
  );
}
