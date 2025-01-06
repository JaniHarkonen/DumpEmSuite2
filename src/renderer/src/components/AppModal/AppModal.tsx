import "./AppModal.css";
import { PropsWithChildren, ReactNode } from "react";


export default function AppModal(props: PropsWithChildren): ReactNode {
  const pChildren: ReactNode = props.children;

  return (
    <div className="app-modal-container user-select-text">
      {pChildren}
    </div>
  );
}
