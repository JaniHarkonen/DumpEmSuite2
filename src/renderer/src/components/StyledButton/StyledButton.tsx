import "./StyledButton.css";

import useTheme from "@renderer/hook/useTheme";
import { Nullish } from "@renderer/utils/Nullish";
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode, useContext } from "react";
import StyledIcon from "../StyledIcon/StyledIcon";
import { TabsContext } from "@renderer/context/TabsContext";


type Props = {
  icon?: string;
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export default function StyledButton(props: Props): ReactNode {
  const pClassName: string = props.className || "";
  const pChildren: ReactNode = props.children;
  const pIcon: string | Nullish = props.icon;

  const {tabIndex} = useContext(TabsContext);
  const {theme} = useTheme();

  return (
    <button
      {...props}
      {...theme("button", "styled-button", pClassName)}
      tabIndex={tabIndex()}
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
