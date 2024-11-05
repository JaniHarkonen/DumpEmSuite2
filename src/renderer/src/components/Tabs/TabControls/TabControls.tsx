import "./TabControls.css";
import { Tab } from "@renderer/model/tabs";
import { ReactNode } from "react";

export type OnSelect = (selectedTab: Tab) => void;

type OnClick = (openedTab: Tab) => void;
type OnDrop = () => void;

type Props = {
  tabs: Tab[];
  onSelect?: OnSelect;
  onClick?: OnClick;
  onDrop?: OnDrop;
};

export default function TabControls(props: Props): ReactNode {
  const pTabs: Tab[] = props.tabs;
  const pOnSelect: OnSelect = props.onSelect || function() {};
  const pOnClick: OnClick = props.onClick || function() {};
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
            onClick={() => pOnClick(tab)}
          >
            {tab.caption}
          </button>
        );
      })}
    </div>
  );
}
