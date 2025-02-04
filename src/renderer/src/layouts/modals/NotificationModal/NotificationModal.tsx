import { MutableRefObject, PropsWithChildren, ReactNode, useRef } from "react";
import { ModalProps, OnModalClose } from "../modal.types";
import useTheme from "@renderer/hook/useTheme";


type Props = {
  message: string;
} & PropsWithChildren & ModalProps;

export default function NotificationModal(props: Props): ReactNode {
  const pMessage: string = props.message;
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
        {...theme("outline-bdc", "ambient-bgc", "standard-modal", "user-select-none")}
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
            <PageHeader enableTextSelect={false}>{pTitle}</PageHeader>
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
