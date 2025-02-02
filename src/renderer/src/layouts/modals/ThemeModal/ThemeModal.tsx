import "./ThemeModal.css";

import { ReactNode, useContext } from "react";
import { ModalProps, OnModalClose } from "../modal.types";
import StandardModal from "../StandardModal/StandardModal";
import useTheme from "@renderer/hook/useTheme";
import Container from "@renderer/components/Container/Container";
import { ModalContext } from "@renderer/context/ModalContext";


type Props = {

} & ModalProps;

export default function ThemeModal(props: Props): ReactNode {
  const pOnClose: OnModalClose | undefined = props.onClose;

  const {theme} = useTheme();
  const {closeModal} = useContext(ModalContext);

  const handleClose = () => {
    if( pOnClose ) {
      pOnClose();
    } else {
      closeModal();
    }
  };

  return (
    <StandardModal
      title="Select theme"
      onClose={handleClose}
    >
      <div {...theme("ambient-bgc")}>
        <Container>
        
        </Container>
      </div>
    </StandardModal>
  );
}
