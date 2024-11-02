import "./Tabs.css";
import { MouseEvent, ReactNode, useState } from "react";
import { Tab } from "@renderer/model/tabs";
import { ContentDirection, SplitSide } from "@renderer/model/splits";

type OnSelect = (tab: Tab) => void;
type OnSplit = (direction: ContentDirection, side: SplitSide) => void;

type Props = {
  tabHeight: number;
  tabs: Tab[];
  activeTab: Tab | null;
  onSelect?: OnSelect;
  onDrop?: Function;
  onSplit?: OnSplit;
  isTabDragging?: boolean;
};

type SplitActivation = {
  x: number;
  y: number;
  width: number;
  height: number;
  splitDirection: ContentDirection;
  splitSide: SplitSide;
}

const SPLIT_ACTIVATIONS: SplitActivation[] = [
  { x: 0, y: 0, width: 100, height: 50, splitDirection: "horizontal", splitSide: "left" }, // Split left
  { x: 50, y: 50, width: 50, height: 100, splitDirection: "horizontal", splitSide: "right" }, // Split right
  { x: 50, y: 0, width: 50, height: 50, splitDirection: "vertical", splitSide: "left" }, // Split top
  { x: 0, y: 50, width: 50, height: 50, splitDirection: "vertical", splitSide: "right" } // Split bottom
];

export default function Tabs(props: Props): ReactNode {
  const pTabHeight: number = props.tabHeight;
  const pTabs: Tab[] = props.tabs;
  const pActiveTab: Tab | null = props.activeTab;
  const pOnSelect: OnSelect = props.onSelect || function() {};
  const pOnDrop: Function = props.onDrop || function() {};
  const pOnSplit: OnSplit = props.onSplit || function() {};
  const pIsTabDragging: boolean = props.isTabDragging || false;

  const [activeTab, setActiveTab] = useState<Tab | null>(pActiveTab);

  const handleSplit = (e: MouseEvent<HTMLElement>) => {
    const {x, y, width, height} = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - x;
    const my = e.clientY - y;
    const w2 = width / 2;
    const h2 = height / 2;
    if( mx <= w2 && my <= h2 ) {
      pOnSplit("horizontal", "left");
    } else if( mx > w2 && my <= h2 ) {
      pOnSplit("vertical", "left");
    } else if( mx <= w2 && my > h2 ) {
      pOnSplit("vertical", "right");
    } else {
      pOnSplit("horizontal", "right");
    }
  };

  return (
    <div className="p-relative tabs-container">
      <div 
        className="w-100" 
        style={{ height: pTabHeight + "px" }}
        onMouseUp={() => pOnDrop()}
      >
        {pTabs.map((tab: Tab) => {
          return (
            <button
              key={tab.workspace + "-tab-button-" + tab.id}
              onMouseDown={() => pOnSelect(tab)}
              onClick={() => setActiveTab(tab)}
            >
              {tab.caption}
            </button>
          );
        })}
      </div>
      <div onMouseUp={handleSplit}>
        {activeTab && activeTab.content}
      </div>

      {/*pIsTabDragging && (
        <div className="p-absolute w-100 h-100">
          {SPLIT_ACTIVATIONS.map((activation: SplitActivation) => {
            return (
              <div 
                key={`split-activation-${activation.splitDirection}-${activation.splitSide}`}
                style={{
                  left: activation.x + "%",
                  top: activation.y + "%",
                  width: activation.width + "%",
                  height: activation.height + "%",
                }}
                className="tab-drop-highlight"
                onMouseUp={() => pOnSplit(activation.splitDirection, activation.splitSide)}
              />
            );
          })}
        </div>
      )*/}
    </div>
  );
}
