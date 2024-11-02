import { ReactNode } from "react";
import Tabs from "./Tabs";
import Divider from "../Divider/Divider";
import useFlexibleSplits from "@renderer/hook/useFlexibleSplits";
import { ContentDirection, SplitSide, SplitTree, SplitTreeFork, SplitTreeNode, SplitTreeValue } from "@renderer/model/splits";
import { Tab } from "@renderer/model/tabs";


type Props = {
  tree: SplitTree;
};

export default function TabbedView(props: Props): ReactNode {
  const pTree = props.tree;

  const {
    splitTree, 
    tabSelection, 
    handleTabSelection, 
    handleTabRelocation, 
    handleTabSplit,
    handleDividerMove
  } = useFlexibleSplits({splitTreeRoot: pTree});

  const renderSplits = (
    root: SplitTreeNode, 
    splitSide: SplitSide = "left", 
    parent: SplitTreeFork | null = null, 
    grandParent: SplitTreeFork | null = null, 
    grandParentSide: SplitSide | null = null
  ): ReactNode => {
    if( !root.isFork ) {
      const valueNode: SplitTreeValue = root as SplitTreeValue;

      return (
        <Tabs
          tabHeight={24}
          tabs={valueNode.value}
          activeTab={null}
          onSelect={(tab: Tab) => handleTabSelection({
            selectedTab: tab, 
            sourceFork: parent!,
            sourceSplitSide: splitSide,
            parentFork: grandParent,
            parentSplitSide: grandParentSide
          })}
          onDrop={() => handleTabRelocation(grandParent!, grandParentSide!, splitSide)}
          onSplit={(requestedDirection: ContentDirection, requestedSide: SplitSide) => {
            handleTabSplit(
              grandParent!, grandParentSide!, splitSide, requestedSide, requestedDirection
            )
          }}
          isTabDragging={!!tabSelection}
        />
      );
    }

    const fork: SplitTreeFork = root as SplitTreeFork;
    return (
      <Divider
        dividerSettings={fork.divider}
        onDividerMove={(newValue: number) => handleDividerMove(fork, newValue)}
      >
        {renderSplits(fork.left, "left", fork, parent, splitSide)}
        {fork.right && renderSplits(fork.right, "right", fork, parent, splitSide)}
      </Divider>
    );
  };

  return (
    <div className="w-100 h-100 overflow-hidden">
      {renderSplits(splitTree.root)}
    </div>
  );
}
