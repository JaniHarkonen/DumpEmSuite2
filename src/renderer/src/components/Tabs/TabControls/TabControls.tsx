import { TabsContext } from "@renderer/context/TabsContext";

import { PropsWithChildren, ReactNode, useContext } from "react";


type Props = {
} & PropsWithChildren;

export default function TabControls(props: Props): ReactNode {
  const pChildren: ReactNode[] | ReactNode = props.children;
  const {onDrop} = useContext(TabsContext);


  return (
    <div onMouseUp={onDrop}>{pChildren}</div>
  );
}
