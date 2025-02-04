import "./StandardModal.css";

import { MouseEvent, MutableRefObject, PropsWithChildren, ReactNode, useRef } from "react";
import ModalWrapper from "../ModalWrapper";
import useTheme from "@renderer/hook/useTheme";
import CloseButton from "@renderer/components/CloseButton/CloseButton";
import { ModalProps, OnModalClose } from "../modal.types";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import useDraggableModal from "@renderer/hook/useDraggableModal";


type Props = {
  title: string;
  className?: string;
} & PropsWithChildren & ModalProps;

export default function StandardModal(props: Props): ReactNode {
  const pTitle: string = props.title;
  const pClassName: string = props.className || "";
  const pChildren: ReactNode = props.children;
  const pOnClose: OnModalClose = props.onClose || function(){ };

  const modalRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

  const {theme} = useTheme();
  const {isDragging, handleDrag, positionStyle} = useDraggableModal({ modalRef });

  const handleClose = (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    pOnClose();
  };

  return (
    <ModalWrapper onOverlayClick={pOnClose}>
      <div
        {...theme("outline-bdc", "ambient-bgc", "standard-modal", "user-select-none", pClassName)}
        style={positionStyle()}
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
            <PageHeader
              enableTextSelect={false}
              h="h3"
            >
              {pTitle}
            </PageHeader>
            <CloseButton onClick={handleClose}/>
          </div>
          <div className="w-100 overflow-auto">
            {pChildren}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
