import "./Tabs.css";
import { PropsWithChildren, ReactNode } from "react";


type Props = {
  controls: ReactNode;
} & PropsWithChildren;

export type TabsProps = Props;

export default function Tabs(props: Props): ReactNode {
  const pControls: ReactNode = props.controls;
  const pChildren: ReactNode[] | ReactNode = props.children;

  return (
    <div className="tabs-container">
      <div className="tab-controls-container">{pControls}</div>
      {pChildren}
    </div>
  );
}
