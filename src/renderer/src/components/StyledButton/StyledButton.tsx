import "./StyledButton.css";

import useTheme from "@renderer/hook/useTheme";
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";


export default function StyledButton(
  props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
): ReactNode {
  const pClassName = props.className || "";
  const pChildren: ReactNode = props.children;

  const {theme} = useTheme();

  return (
    <button
      {...props}
      {...theme("button", "styled-button", pClassName)}
    >
      {pChildren}
    </button>
  );
}
