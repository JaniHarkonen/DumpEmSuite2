import { ReactNode } from "react";
import Tabs from "./Tabs";
import Divider from "../Divider/Divider";
import useFlexibleSplits from "@renderer/hook/useFlexibleSplits";
import { ContentDirection, SplitSide, SplitTree, SplitTreeFork, SplitTreeNode, SplitTreeValue } from "@renderer/model/splits";
import { Tab } from "@renderer/model/tabs";


const testSplitTree: SplitTree = {
  root: {
    isFork: true,
    side: null,
    //direction: "horizontal",
    divider: {
      direction: "horizontal",
        value: 0.5
    },
    left: {
      isFork: true,
      side: null,
      //direction: "horizontal",
      divider: {
        direction: "horizontal",
        value: 0.5
      },
      left: {
        isFork: false,
        side: "left",
        value: [
          {id: "left-side", workspace: "test", caption: "Left side", content: <>left side works</>},
          {id: "another-test", workspace: "test", caption: "Another Test", content: <>another test.... works</>},
          {id: "new-test", workspace: "test", caption: "New Test", content: <>new test works</>},
          {id: "third-test", workspace: "test", caption: "third Test", content: <>third test here</>},
          {id: "test-test", workspace: "test", caption: "TEST Test", content: <>test of tests</>},
          {id: "final-test", workspace: "test", caption: "FINAL Test", content: <>final test</>},
          {id: "last-test", workspace: "test", caption: "last Test", content: <>actual last test</>},
        ]
      }
    }
  }
};

type Props = {
  //views: View[]
};

export default function TabbedView(props: Props): ReactNode {
  const {
    splitTree, 
    tabSelection, 
    handleTabSelection, 
    handleTabRelocation, 
    handleTabSplit,
    handleDividerMove
  } = useFlexibleSplits({splitTreeRoot: testSplitTree});

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
        /*direction={fork.direction}*/ 
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
