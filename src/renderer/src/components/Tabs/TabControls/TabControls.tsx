import "./TabControls.css";

import { TabsContext } from "@renderer/context/TabsContext";

import { PropsWithChildren, ReactNode, useContext } from "react";


export default function TabControls(props: PropsWithChildren): ReactNode {
  const pChildren: ReactNode[] | ReactNode = props.children;
  const {tabs, onDrop} = useContext(TabsContext);

  
  return (
    <div
      className="tab-controls"
      onMouseUp={() => onDrop && onDrop(tabs.length)}
    >
      {pChildren}
    </div>
  );
}
