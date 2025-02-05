import "./CloseButton.css";

import { ASSETS } from "@renderer/assets/assets";
import { HTMLProps, ReactNode } from "react";
import useTheme from "@renderer/hook/useTheme";


export default function CloseButton(props: HTMLProps<HTMLSpanElement>): ReactNode {
  const pClassName: string = props.className || "";
  const {theme} = useTheme();

  return (
    <span
      {...props}
      {...theme("highlight-hl", "size-small-icon", "close-button", pClassName)}
      role="button"
    >
      <img
        {...theme("w-100 h-100", "glyph-svg")}
        src={ASSETS.icons.action.close.black}
      />
    </span>
  );
}
