import "./AppModal.css";

import { ModalContext } from "@renderer/context/ModalContext";
import { PropsWithChildren, ReactNode, useContext, useEffect } from "react";


export default function AppModal(props: PropsWithChildren): ReactNode {
  const pChildren: ReactNode = props.children;
  const {closeModal} = useContext(ModalContext);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if( e.key === "Escape" ) {
        closeModal();
      }
    }
    
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [])

  return (
    <div
      className="app-modal-container user-select-text"
    >
      {pChildren}
    </div>
  );
}
