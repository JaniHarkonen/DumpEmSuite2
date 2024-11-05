import { ReactNode } from "react";
import Divider from "../Divider/Divider";
import useFlexibleSplits from "@renderer/hook/useFlexibleSplits";
import { Tab, TabContentProvider } from "@renderer/model/tabs";
import { DividerDirection, SplitBranch, SplitTree, SplitTreeBlueprint, SplitTreeFork, SplitTreeManager, SplitTreeNode, SplitTreeValue } from "@renderer/model/splits";
import TabsWithDropArea from "../TabsWithDropArea/TabsWithDropArea";
import { DropAreaSettings } from "../DropArea/DropArea";
import { quadrantDropAreas } from "../DropArea/quadrantDropAreas";


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
      case "template1": return <>test template1 working</>;
      case "template2": return <>template2 working</>;
      case "template3": return <>temp3</>;
      case "template4": return <>t4 works as well</>;
      case "template5": return <>final template works too</>;
    }
    return <>FAILED</>;
  }
};
const testTreeBuilt: SplitTree = SplitTreeManager.buildTree(testBlueprint, testContentProvider)!;

const dropAreas: DropAreaSettings[] = quadrantDropAreas(
  <div 
    style={{
      backgroundColor: "red", 
      width: "100%", 
      height: "100%", 
      opacity: "25%"
    }}
  />
);

export default function SplitView(props: Props): ReactNode {
  const {
    splitTree, 
    tabSelection, 
    handleTabSelection, 
    handleTabRelocation, 
    handleTabSplit,
    handleDividerMove
  } = useFlexibleSplits({ splitTree: testTreeBuilt });

  const handleTabContentDrop = (dropArea: DropAreaSettings, toFork: SplitTreeFork) => {
      // Maps drop areas to DividerDirections and DividerDirections to SplitBranches
    const json = {
      "top-left": "horizontal",
      "top-right": "vertical",
      "bottom-left": "vertical",
      "bottom-right": "horizontal",
      "horizontal": {
        "top-left": "left",
        "bottom-right": "right"
      },
      "vertical": {
        "top-right": "left",
        "bottom-left": "right"
      }
    };
    const requestedDirection: DividerDirection = json[dropArea.id];
    const requestedBranch: SplitBranch = json[requestedDirection][dropArea.id];
    handleTabSplit(toFork, requestedDirection, requestedBranch);
  };

  const renderSplits = (root: SplitTreeNode): ReactNode => {
    if( !root.isFork ) {
      const valueNode: SplitTreeValue = root as SplitTreeValue;

      return (
        <TabsWithDropArea
          tabs={valueNode.value}
          activeTab={null}
          onSelect={(tab: Tab) => handleTabSelection({
            selectedTab: tab,
            sourceFork: valueNode.parent!,
            sourceValueNode: valueNode
          })}
          isDropActive={!!tabSelection}
          onTabDrop={() => handleTabRelocation(valueNode)}
          onContentDrop={(dropArea: DropAreaSettings) => handleTabContentDrop(dropArea, valueNode.parent!)}
          dropAreas={dropAreas}
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


        // {/*<Tabs
        //   tabHeight={24}
        //   tabs={valueNode.value}
        //   activeTab={null}
        //   onSelect={(tab: Tab) => handleTabSelection({
        //     selectedTab: tab,
        //     sourceFork: valueNode.parent!,
        //     sourceValueNode: valueNode
        //   })}
        //   onTabDrop={() => handleTabRelocation(valueNode)}
        //   onContentDrop={(dropArea: DropArea) => handleTabContentDrop(dropArea, valueNode.parent!)}
        //   isDropActive={!!tabSelection}
        //   dropAreaHighlights={{
        //     "top-left": {
        //       enabled: true,
        //       element: <div style={{backgroundColor: "red", opacity: "25%", width: "100%", height: "100%"}}></div>
        //     },
        //     "top-right": {
        //       enabled: true,
        //       element: <div style={{backgroundColor: "red", opacity: "25%", width: "100%", height: "100%"}}></div>
        //     },
        //     "bottom-left": {
        //       enabled: true,
        //       element: <div style={{backgroundColor: "red", opacity: "25%", width: "100%", height: "100%"}}></div>
        //     },
        //     "bottom-right": {
        //       enabled: true,
        //       element: <div style={{backgroundColor: "red", opacity: "25%", width: "100%", height: "100%"}}></div>
        //     }
        //   }}
        // />*/}