import { TabsContext, TabsContextType } from "@renderer/context/TabsContext";
import "./TabControls.css";

import { Tab } from "@renderer/model/tabs";
import { ReactNode, useContext } from "react";


type ItemConstructorProps = {
  tab: Tab;
};

function DefaultItemConstructor(props: ItemConstructorProps): ReactNode {
  const pTab: Tab = props.tab;
  const {onSelect, onOpen} = useContext(TabsContext);

  return (
    <button
      key={pTab.workspace + "-tab-button-" + pTab.id}
      onMouseDown={() => onSelect && onSelect(pTab)}
      onClick={() => onOpen && onOpen(pTab)}
    >
      {pTab.caption}
    </button>
  );
}

type Props = {
  ItemConstructor?: (props: ItemConstructorProps) => ReactNode;
};

export default function TabControls(props: Props): ReactNode {
  const pItemConstructor = props.ItemConstructor || DefaultItemConstructor;
  
  const tabsContext: TabsContextType = useContext(TabsContext);
  const {tabs, onDrop} = tabsContext;


  return (
    <div
      className="tab-controls-container"
      onMouseUp={onDrop}
    >
      {tabs.map((tab: Tab) => {
        return pItemConstructor({ tab });
      })}
    </div>
  );
}
