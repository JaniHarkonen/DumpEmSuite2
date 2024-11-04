import { ReactNode } from "react";
import Tabs from "./Tabs";
import Divider from "../Divider/Divider";
import useFlexibleSplits from "@renderer/hook/useFlexibleSplits";
import { Tab, TabContentProvider } from "@renderer/model/tabs";
import { DividerDirection, SplitBranch, SplitTree, SplitTreeBlueprint, SplitTreeFork, SplitTreeManager, SplitTreeNode, SplitTreeValue } from "@renderer/model/splits";


type Props = {
  //tree: SplitTree;
};

const testBlueprint: SplitTreeBlueprint = {
  root: {
    isFork: true,
    divider: { direction: "horizontal", value: 50 },
    left: {
      isFork: true,
      divider: {direction: "vertical", value: 33},
      left: {
        isFork: true,
        divider: {direction: "horizontal", value: 100},
        left: {
          isFork: false,
          value: [
            {id: "left-left-left", caption: "left left left", workspace: "ws", contentTemplate: "template1"},
            // {id: "left-left-left2", caption: "left left left2", workspace: "ws", contentTemplate: "template2"},
            // {id: "left-left-left3", caption: "left left left3", workspace: "ws", contentTemplate: "template3"},
          ]
        }
      },
      right: {
        isFork: true,
        divider: {direction: "vertical", value: 10},
        left: {
          isFork: false,
          value: [
            {id: "left-right-left", caption: "left right left", workspace: "ws", contentTemplate: "template4"},
            // {id: "left-right-left2", caption: "left right left2", workspace: "ws", contentTemplate: "template5"},
          ]
        }
      }
    }
  }
};
const testContentProvider: TabContentProvider = {
  getContent: (contentTemplate: string) => {
    switch(contentTemplate) {
      case "template1": <>test template1 working</>; break;
      case "template2": <>template2 working</>; break;
      case "template3": <>temp3</>; break;
      case "template4": <>t4 works as well</>; break;
      case "template5": <>final template works too</>; break;
    }
    return <>FAILED</>;
  }
}
const testTreeBuilt: SplitTree = SplitTreeManager.buildTree(testBlueprint, testContentProvider)!;

export default function SplitView(props: Props): ReactNode {
  const {
    splitTree, 
    tabSelection, 
    handleTabSelection, 
    handleTabRelocation, 
    handleTabSplit,
    handleDividerMove
  } = useFlexibleSplits({ splitTree: testTreeBuilt });

  const renderSplits = (root: SplitTreeNode): ReactNode => {
    if( !root.isFork ) {
      const valueNode: SplitTreeValue = root as SplitTreeValue;

      return (
        <Tabs
          tabHeight={24}
          tabs={valueNode.value}
          activeTab={null}
          onSelect={(tab: Tab) => handleTabSelection({
            selectedTab: tab,
            sourceFork: valueNode.parent!,
            sourceValueNode: valueNode
          })}
          onDrop={() => handleTabRelocation(valueNode)}
          onSplit={(requestedDirection: DividerDirection, requestedBranch: SplitBranch) => {
            handleTabSplit(valueNode.parent!, requestedDirection, requestedBranch);
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
        {renderSplits(fork.left)}
        {fork.right && renderSplits(fork.right)}
      </Divider>
    );
  };

  return (
    <div className="w-100 h-100 overflow-hidden">
      {splitTree && renderSplits(splitTree.root)}
    </div>
  );
}
