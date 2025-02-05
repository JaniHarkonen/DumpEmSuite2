import "./StandardModal.css";

import { MouseEvent, MutableRefObject, PropsWithChildren, ReactNode, useContext, useRef } from "react";
import ModalWrapper from "../ModalWrapper";
import useTheme from "@renderer/hook/useTheme";
import CloseButton from "@renderer/components/CloseButton/CloseButton";
import { ModalProps, OnModalClose } from "../modal.types";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import useDraggableModal from "@renderer/hook/useDraggableModal";
import { ModalContext } from "@renderer/context/ModalContext";


type Props = {
  title: string;
  className?: string;
  preventDefault?: boolean;
} & PropsWithChildren & ModalProps;

export default function StandardModal(props: Props): ReactNode {
  const pTitle: string = props.title;
  const pClassName: string = props.className || "";
  const pChildren: ReactNode = props.children;
  const pPreventDefault: boolean = props.preventDefault ?? false;
  const pOnClose: OnModalClose = props.onClose || function(){ };

  const modalRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

  const {theme} = useTheme();
  const {isDragging, handleDrag, positionStyle} = useDraggableModal({ modalRef });
  const {closeModal} = useContext(ModalContext);

  const handleClose = () => {
    pOnClose();

    if( !pPreventDefault ) {
      closeModal();
    }
  };

  const withStoppedPropagation = (e: MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  return (
    <ModalWrapper onOverlayClick={handleClose}>
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
              className="mt-strong-length mb-strong-length"
            >
              {pTitle}
            </PageHeader>
            <CloseButton onClick={(e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
              withStoppedPropagation(e, handleClose);
            }}/>
          </div>
          <div className="w-100 overflow-auto">
            {pChildren}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
