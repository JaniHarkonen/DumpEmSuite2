import "./StandardModal.css";

import { PropsWithChildren, ReactNode } from "react";
import ModalWrapper from "../ModalWrapper";
import useTheme from "@renderer/hook/useTheme";
import CloseButton from "@renderer/components/CloseButton/CloseButton";
import { ModalProps, OnModalClose } from "../modal.types";
import PageHeader from "@renderer/components/PageHeader/PageHeader";


type Props = {
  title: string;
} & PropsWithChildren & ModalProps;

export default function StandardModal(props: Props): ReactNode {
  const pTitle: string = props.title;
  const pChildren: ReactNode = props.children;
  const pOnClose: OnModalClose = props.onClose || function(){ };

  const {theme} = useTheme();

  return (
    <ModalWrapper>
      <div {...theme("outline-bdc", "ambient-bgc", "standard-modal")}>
        <div className="standard-modal-content-container">
          <div className="standard-modal-title-container">
            <PageHeader>{pTitle}</PageHeader>
            <div className="d-flex d-justify-center d-align-items-center">
              <CloseButton onClick={pOnClose}/>
            </div>
          </div>
          <div className="w-100 h-100 overflow-auto">
            {pChildren}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
