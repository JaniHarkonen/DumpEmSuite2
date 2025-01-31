import "./StyledButton.css";

import useTheme from "@renderer/hook/useTheme";
import { Nullish } from "@renderer/utils/Nullish";
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import StyledIcon from "../StyledIcon/StyledIcon";


type Props = {
  icon?: string;
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export default function StyledButton(props: Props): ReactNode {
  const pClassName: string = props.className || "";
  const pChildren: ReactNode = props.children;
  const pIcon: string | Nullish = props.icon;

  const {theme} = useTheme();

  return (
    <button
      {...props}
      {...theme("button", "styled-button", pClassName)}
    >
      {pChildren}
      {pIcon && (
        <StyledIcon 
          className={"size-tiny-icon " + (pChildren ? " ml-medium-length" : "")}
          src={pIcon}
        />
      )}
    </button>
  );
}
