import "./ModalWrapper.css";

import { PropsWithChildren, ReactNode } from "react";


export default function ModalWrapper(props: PropsWithChildren): ReactNode {
  const pChildren: ReactNode = props.children;
  
  return (
    <div className="modal-wrapper">
      {pChildren}
    </div>
  );
}
