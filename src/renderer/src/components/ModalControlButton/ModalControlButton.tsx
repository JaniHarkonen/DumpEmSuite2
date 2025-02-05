import "./ModalControlButton.css";

import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import StyledButton from "../StyledButton/StyledButton";


export default function ModalControlButton(
  props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
): ReactNode {
  const pChildren: ReactNode = props.children;
  return (
    <StyledButton
      {...props}
      className="modal-control-button"
    >
      {pChildren}
    </StyledButton>
  );
}
