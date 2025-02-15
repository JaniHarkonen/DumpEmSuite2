import "./YesNoModal.css";

import { PropsWithChildren, ReactNode, useContext } from "react";
import StandardModal from "../StandardModal/StandardModal";
import useTheme from "@renderer/hook/useTheme";
import ModalControlButton from "@renderer/components/ModalControlButton/ModalControlButton";
import { ModalProps, OnModalClose } from "../modal.types";
import { ModalContext } from "@renderer/context/ModalContext";
import useDocumentHotkeys from "@renderer/hook/useDocumentHotkeys";


type OnModalYes = () => void;

type Props = {
  onYes?: OnModalYes;
} & PropsWithChildren & ModalProps;

export default function YesNoModal(props: Props): ReactNode {
  const pChildren: ReactNode = props.children;
  const pOnYes: OnModalYes | undefined = props.onYes;
  const pOnClose: OnModalClose | undefined = props.onClose;

  const {theme} = useTheme();
  const {closeModal} = useContext(ModalContext);

  const handleYes = () => {
    pOnYes && pOnYes();
    closeModal();
  };
  
  const handleCancel = () => {
    pOnClose && pOnClose();
    closeModal();
  };

  useDocumentHotkeys({ actionMap: {
    "confirm": handleYes,
    "deny": handleCancel  
  }});

  return (
    <StandardModal
      title="Confirmation"
      className="yes-no-modal"
      onClose={pOnClose}
    >
      <div {...theme("glyph-c")}>
        <div>
          {pChildren}
        </div>
        <div className="yes-no-modal-controls">
          <ModalControlButton onClick={handleYes}>Yes</ModalControlButton>
          <ModalControlButton
            autoFocus={true}
            onClick={handleCancel}
          >
            Cancel
          </ModalControlButton>
        </div>
      </div>
    </StandardModal>
  );
}
