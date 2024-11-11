import { Tab } from "@renderer/model/tabs";
import "./TabButton.css";
import { ReactNode, useContext } from "react";
import { TabsContext } from "@renderer/context/TabsContext";


type Props = {
  tab: Tab;
};

export default function TabButton(props: Props): ReactNode {
  const pTab: Tab = props.tab;

  const {onSelect, onOpen} = useContext(TabsContext);

  
  return (
    <button
      onMouseDown={() => onSelect && onSelect(pTab)}
      onClick={() => onOpen && onOpen(pTab)}
    >
      {pTab.caption}
    </button>
  );
}
