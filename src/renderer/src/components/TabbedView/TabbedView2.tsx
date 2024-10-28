
import { ReactNode, useState } from "react";
import Tabs, { Tab } from "./Tabs";
import Divider from "../Divider/Divider";
import { ContentDirection } from "@renderer/model/view";


type Props = {
  //views: View[]
};

type SplitSide = "left" | "right";

export type TabSelection = {
  selectedTab: Tab;
  sourceSplitIndex: number;
  sourceSplitSide: SplitSide;
} | null;

type Split = {
  direction: ContentDirection;
  left: Tab[];
  right?: Tab[] | null;
}

const testSplits: Split[] = [
  {
    direction: "horizontal",
    left: [
      {id: "left-side", workspace: "test", caption: "Left side", content: <>left side works</>},
      {id: "right-side", workspace: "test", caption: "Right Test", content: <>right side works</>}
    ]
  },
  {
    direction: "vertical",
    left: [
      {id: "new-test", workspace: "test", caption: "New Test", content: <>new test works</>},
      {id: "another-test", workspace: "test", caption: "Another Test", content: <>another test.... works</>}
    ],
    right: [
      {id: "third-test", workspace: "test", caption: "Third Test", content: <>this one works too</>}
    ]
  }
];

export default function TabbedView(props: Props) {
  const [splits, setSplits] = useState<Split[]>(testSplits);
  const [tabSelection, setTabSelection] = useState<TabSelection>(null);

  const handleTabSelection = (selectedTab: Tab, sourceSplitIndex: number, sourceSplitSide: SplitSide) => {
    setTabSelection({
      selectedTab,
      sourceSplitIndex,
      sourceSplitSide
    });
  };

  const handleTabRelocation = (targetSplitIndex: number, targetSplitSide: SplitSide) => {
    setSplits((prevSplits: Split[]) => {
      if( !tabSelection ) return prevSplits;  // No selection
      
        // Invalid source split index
      const {selectedTab, sourceSplitIndex, sourceSplitSide} = tabSelection;
      if( !prevSplits[sourceSplitIndex] ) return prevSplits;

        // Attempting to relocate to the same tab (not a relocation)
      if( sourceSplitIndex === targetSplitIndex && sourceSplitSide === targetSplitSide ) return prevSplits;

        // Invalid source split side
      const sourceTabs: Tab[] | null | undefined = prevSplits[sourceSplitIndex][sourceSplitSide];
      if( !sourceTabs ) return prevSplits;

        // Selected tab no longer exists
      const sourceTabIndex = sourceTabs.indexOf(selectedTab);
      if( sourceTabIndex < 0 ) return prevSplits;

        // Invalid target split index
      if( !prevSplits[targetSplitIndex] ) return prevSplits;

        // Add tab to target
      const newSplits = [...prevSplits];
      const targetSplit: Split = newSplits[targetSplitIndex];
      if( !targetSplit[targetSplitSide] ) {
        targetSplit[targetSplitSide] = [selectedTab];
      } else {
        targetSplit[targetSplitSide].push(selectedTab);
      }

        // Remove tab from source
      const sourceSplit: Split = newSplits[sourceSplitIndex];
      if( sourceTabs.length === 1 ) {
        if( sourceSplitSide === "right" ) { // Consume right, if it goes empty
          sourceSplit.right = null;
        } else if( !sourceSplit.right ) { // Consume split, if left and right go empty
          newSplits.splice(sourceSplitIndex, 1);
        } else { // Move right to left, if left goes empty
          sourceSplit.left = sourceSplit.right;
          sourceSplit.right = null;
        }
      } else {
        sourceSplit[sourceSplitSide]!.splice(sourceTabIndex, 1);
      }

      return newSplits;
    });
  };

  const renderSplitTabs = (splitIndex: number, splitSide: SplitSide): ReactNode => {
    return (
      <Tabs
        tabHeight={24}
        tabs={splits[splitIndex][splitSide]!}
        activeTab={null}
        tabGroupIndex={-1}
        onSelect={(tab: Tab) => handleTabSelection(tab, splitIndex, splitSide)}
        onDrop={() => handleTabRelocation(splitIndex, splitSide)}
      />
    );
  };

    // Render splits recursively
  const renderSplits = (splitIndex: number): ReactNode => {
    return (
      <Divider direction="horizontal">
        <Divider direction={splits[splitIndex].direction}>
          {renderSplitTabs(splitIndex, "left")}
          {splits[splitIndex].right && renderSplitTabs(splitIndex, "right")}
        </Divider>
        {splitIndex < splits.length - 1 && renderSplits(splitIndex + 1)}
      </Divider>
    );
  };

  return (
    <div className="w-100 h-100 overflow-hidden">
      {renderSplits(0)}
    </div>
  );
}
