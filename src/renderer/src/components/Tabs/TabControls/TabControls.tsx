import "./TabControls.css";

import { Tab } from "@renderer/model/tabs";
import { ReactNode } from "react";


export type OnSelect = (selectedTab: Tab) => void;
export type OnOpen = (openedTab: Tab) => void;

type OnDrop = () => void;

type Props = {
  tabs: Tab[];
  onSelect?: OnSelect;
  onOpen?: OnOpen;
  onDrop?: OnDrop;
};

export default function TabControls(props: Props): ReactNode {
  const pTabs: Tab[] = props.tabs;
  const pOnSelect: OnSelect = props.onSelect || function() {};
  const pOnOpen: OnOpen = props.onOpen || function() {};
  const pOnDrop: OnDrop = props.onDrop || function() {};

  return (
    <div
      className="tab-controls-container"
      onMouseUp={pOnDrop}
    >
      {pTabs.map((tab: Tab) => {
        return (
          <button
            key={tab.workspace + "-tab-button-" + tab.id}
            onMouseDown={() => pOnSelect(tab)}
            onClick={() => pOnOpen(tab)}
          >
            {tab.caption}
          </button>
        );
      })}
    </div>
  );
}
