import "./ModalWrapper.css";

import { PropsWithChildren, ReactNode } from "react";


type Props = {
  onOverlayClick?: () => void;
} & PropsWithChildren;

export default function ModalWrapper(props: Props): ReactNode {
  const pChildren: ReactNode = props.children;
  const pOnOverlayClick: () => void = props.onOverlayClick || function(){ };
  
  return (
    <div className="w-100 h-100">
      <div 
        className="modal-wrapper-overlay"
        onClick={pOnOverlayClick}
      />
      {pChildren}
    </div>
  );
}
