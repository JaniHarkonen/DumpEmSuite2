import { ReactNode } from "react";
import Tabs from "./Tabs";
import Divider from "../Divider/Divider";
import { ContentDirection } from "@renderer/model/view";
import useFlexibleSplits from "@renderer/hook/useFlexibleTabs";
import { SplitSide, SplitTree, SplitTreeFork, SplitTreeNode, SplitTreeValue } from "@renderer/model/splits";
import { Tab } from "@renderer/model/tabs";


type Props = {
  //views: View[]
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
          {id: "test-test", workspace: "test", caption: "TEST Test", content: <>test of tests</>},
          {id: "final-test", workspace: "test", caption: "FINAL Test", content: <>final test</>},
          {id: "last-test", workspace: "test", caption: "last Test", content: <>actual last test</>},
        ]
      }
    }
  }
};

export default function TabbedView(props: Props): ReactNode {
  const {
    splitTree, 
    tabSelection, 
    handleTabSelection, 
    handleTabRelocation, 
    handleTabSplit
  } = useFlexibleSplits({splitTreeRoot: testSplitTree});

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
          onSplit={(requestedDirection: ContentDirection, requestedSide: SplitSide) => {
            handleTabSplit(parent!, requestedSide, requestedDirection);
          }}
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
