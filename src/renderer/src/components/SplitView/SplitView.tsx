import { ReactNode, useContext } from "react";
import Divider from "../Divider/Divider";
import { indexOfTab, Tab } from "@renderer/model/tabs";
import { DividerDirection, SplitBranch, SplitTreeFork, SplitTreeNode, SplitTreeValue } from "@renderer/model/splits";
import TabsWithDropArea from "../TabsWithDropArea/TabsWithDropArea";
import { DropAreaSettings } from "../DropArea/DropArea";
import { quadrantDropAreas } from "../DropArea/quadrantDropAreas";
import { TabsContext } from "@renderer/context/TabsContext";
import TabPanel from "../Tabs/TabPanel/TabPanel";
import { FlexibleSplitsContext } from "@renderer/context/FlexibleSplitsContext";
import useTheme from "@renderer/hook/useTheme";
import useTabKeys from "@renderer/hook/useTabKeys";


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

type RenderControls = (targetNode: SplitTreeValue) => ReactNode;

type Props = {
  renderControls: RenderControls;
};

export default function SplitView(props: Props): ReactNode {
  const pRenderControls: RenderControls = props.renderControls;

  const {
    splitTree, 
    tabSelection, 
    handleTabSelection, 
    handleTabOpen,
    handleTabRelocation, 
    handleTabReorder,
    handleTabSplit,
    handleDividerMove,
    handleExtraInfo
  } = useContext(FlexibleSplitsContext);

  const {theme} = useTheme();
  const {formatKey} = useTabKeys();
  const {tabIndex} = useContext(TabsContext);

  const handleTabContentDrop = (dropArea: DropAreaSettings, toFork: SplitTreeFork) => {
      // Maps drop areas to DividerDirections and DividerDirections to SplitBranches
    const branchings = {
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
    const requestedDirection: DividerDirection = branchings[dropArea.id];
    const requestedBranch: SplitBranch = branchings[requestedDirection][dropArea.id];
    handleTabSplit && handleTabSplit(toFork, requestedDirection, requestedBranch);
  };

  const renderTabPanels = (tabs: Tab[]): ReactNode => {
    return tabs.map((tab: Tab) => {
      return (
        <TabPanel
          key={formatKey(tab.workspace + "-tab-panel-" + tab.id)}
          tab={tab}
        >
          {tab.content}
        </TabPanel>
      );
    });
  };

  const renderSplits = (root: SplitTreeNode): ReactNode => {
    if( !root.isFork ) {
      const valueNode: SplitTreeValue = root as SplitTreeValue;
      const nodeTabs: Tab[] = valueNode.value.tabs;
      const activeTabIndex: number = valueNode.value.activeTabIndex;

      const decideRelocationOrReorder = (index: number) => {
        if( !tabSelection ) {
          return;
        } else if( tabSelection.sourceValueNode === valueNode ) {
          return handleTabReorder && handleTabReorder(valueNode, index);
        } else {
          handleTabRelocation && handleTabRelocation(valueNode, index);
        }
      };

      return (
        <TabsContext.Provider value={{
            tabs: nodeTabs,
            activeTabIndex,
            onSelect: (selectedTab: Tab) => handleTabSelection && handleTabSelection({
              selectedTab: selectedTab,
              sourceFork: valueNode.parent!,
              sourceValueNode: valueNode
            }),
            onOpen: (openedTab: Tab) => {
              handleTabOpen && handleTabOpen(valueNode, indexOfTab(nodeTabs, openedTab));
              
              const collection: HTMLCollectionOf<Element> = 
                document.getElementsByClassName(openedTab.id);
              
              for( let i = 0; i < collection.length; i++ ) {
                const element: Element | null = collection.item(i);

                if( element ) {
                  const htmlElement: HTMLElement = element as HTMLElement;

                  if( !htmlElement.classList.contains(openedTab.workspace) ) {
                    continue;
                  }
                  
                  htmlElement.focus();

                  for( let child of element.children ) {
                    const htmlChild: HTMLElement | null = child as (HTMLElement | null);

                    if( !htmlChild ) {
                      continue;
                    }

                    if( htmlChild.tabIndex >= htmlElement.tabIndex ) {
                      htmlChild.focus();
                    }
                  }
                }
              }
            },
            onDrop: decideRelocationOrReorder,
            setExtraInfo: (extraInfo: any) => {
              handleExtraInfo && handleExtraInfo(valueNode, nodeTabs[activeTabIndex], extraInfo);
            },
            tabIndex: () => tabIndex() + 2
          }}
        >
          <TabsWithDropArea
            controls={pRenderControls(valueNode)}
            dropAreas={dropAreas}
            onContentDrop={(dropArea: DropAreaSettings) => {
              handleTabContentDrop(dropArea, valueNode.parent!);
            }}
            isDropActive={!!tabSelection}
          >
            {renderTabPanels(nodeTabs)}
          </TabsWithDropArea>
        </TabsContext.Provider>
      );
    }

    const fork: SplitTreeFork = root as SplitTreeFork;
    return (
      <Divider
        dividerSettings={fork.divider}
        onDividerMove={(newValue: number) => {
          handleDividerMove && handleDividerMove(fork, newValue);
        }}
      >
        {renderSplits(fork.left)}
        {fork.right && renderSplits(fork.right)}
      </Divider>
    );
  };


  return (
    <div {...theme("glyph-c", "w-100 h-100 overflow-hidden")}>
      {splitTree && renderSplits(splitTree.root)}
    </div>
  );
}
