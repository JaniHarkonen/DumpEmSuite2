import "./StandardModal.css";

import { MouseEvent, MutableRefObject, PropsWithChildren, ReactNode, useEffect, useRef } from "react";
import ModalWrapper from "../ModalWrapper";
import useTheme from "@renderer/hook/useTheme";
import CloseButton from "@renderer/components/CloseButton/CloseButton";
import { ModalProps, OnModalClose } from "../modal.types";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import useDraggableElement from "@renderer/hook/useDraggableElement";


type Props = {
  title: string;
} & PropsWithChildren & ModalProps;

export default function StandardModal(props: Props): ReactNode {
  const pTitle: string = props.title;
  const pChildren: ReactNode = props.children;
  const pOnClose: OnModalClose = props.onClose || function(){ };

  const modalRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

  const {theme} = useTheme();
  const {isDragging, position, setPosition, startDragging} = useDraggableElement([]);

  useEffect(() => {
    const bbox: DOMRect | undefined = modalRef.current?.getBoundingClientRect();

    setPosition({
      x: window.innerWidth / 2 - ((bbox?.width ?? 0) / 2), 
      y: window.innerHeight / 2 - ((bbox?.height ?? 0) / 2)
    });
  }, []);

  const handleDrag = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const {x, y} = e.currentTarget.getBoundingClientRect();

    startDragging({
      x: e.pageX - x, 
      y: e.pageY - y
    });
  };

  const handleClose = (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    pOnClose();
  };

  return (
    <ModalWrapper onOverlayClick={pOnClose}>
      <div
        {...theme("outline-bdc", "ambient-bgc", "standard-modal", "user-select-none")}
        style={{
          left: position.x + "px",
          top: position.y + "px"
        }}
        ref={modalRef}
      >
        <div className="standard-modal-content-container">
          <div
            className="standard-modal-title-container"
            onMouseDown={handleDrag}
            style={{
              cursor: isDragging ? "grabbing" : "grab"
            }}
          >
            <PageHeader enableTextSelect={false}>{pTitle}</PageHeader>
            <CloseButton onClick={handleClose}/>
          </div>
          <div className="w-100 h-100 overflow-auto">
            {pChildren}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
