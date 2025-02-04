import "./YesNoModal.css";

import { PropsWithChildren, ReactNode, useContext } from "react";
import StandardModal from "../StandardModal/StandardModal";
import { ModalContext } from "@renderer/context/ModalContext";
import useTheme from "@renderer/hook/useTheme";
import ModalControlButton from "@renderer/components/ModalControlButton/ModalControlButton";
import { ModalProps, OnModalClose } from "../modal.types";


type OnModalYes = () => void;

type Props = {
  onYes?: OnModalYes;
} & PropsWithChildren & ModalProps;

export default function YesNoModal(props: Props): ReactNode {
  const pChildren: ReactNode = props.children;
  const pOnYes: OnModalYes | undefined = props.onYes;
  const pOnClose: OnModalClose | undefined = props.onClose;

  const {closeModal} = useContext(ModalContext);
  const {theme} = useTheme();

  const handleClose = () => {
    if( pOnClose ) {
      pOnClose();
    } else {
      closeModal();
    }
  };

  return (
    <StandardModal
      title="Confirmation"
      className="yes-no-modal"
      onClose={handleClose}
    >
      <div {...theme("glyph-c")}>
        <div>
          {pChildren}
        </div>
        <div className="yes-no-modal-controls">
          <ModalControlButton onClick={pOnYes}>Yes</ModalControlButton>
          <ModalControlButton onClick={handleClose}>Cancel</ModalControlButton>
        </div>
      </div>
    </StandardModal>
  );
}
