import "./TabButton.css";

import { Tab } from "@renderer/model/tabs";
import { PropsWithChildren, ReactNode, useContext } from "react";
import { TabsContext } from "@renderer/context/TabsContext";


type Props = {
  tab: Tab;
} & PropsWithChildren;

export default function TabButton(props: Props): ReactNode {
  const pTab: Tab = props.tab;
  const pChildren: ReactNode[] | ReactNode = props.children;

  const {onSelect, onOpen} = useContext(TabsContext);

  
  return (
    <button
      className="tab-controls-button"
      onMouseDown={() => onSelect && onSelect(pTab)}
      onClick={() => onOpen && onOpen(pTab)}
    >
      <span>{pTab.caption}</span>
      {pChildren}
    </button>
  );
}
