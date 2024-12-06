import "./TabButton.css";

import { indexOfTab, Tab } from "@renderer/model/tabs";
import { PropsWithChildren, ReactNode, useContext } from "react";
import { TabsContext } from "@renderer/context/TabsContext";


type Props = {
  tab: Tab;
} & PropsWithChildren;

export default function TabButton(props: Props): ReactNode {
  const pTab: Tab = props.tab;
  const pChildren: ReactNode[] | ReactNode = props.children;

  const {tabs, onSelect, onOpen, onDrop} = useContext(TabsContext);

  const handleTabDrop = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const index: number = indexOfTab(tabs, pTab);
    e.stopPropagation();
    onDrop && onDrop(index);
  };
  

  return (
    <button
      className="tab-controls-button"
      onMouseDown={() => onSelect && onSelect(pTab)}
      onClick={() => onOpen && onOpen(pTab)}
      onMouseUp={handleTabDrop}
    >
      <span>{pTab.caption}</span>
      {pChildren}
    </button>
  );
}
