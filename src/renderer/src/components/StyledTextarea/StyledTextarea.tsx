import "./StyledTextarea.css";

import useTheme from "@renderer/hook/useTheme";
import { HTMLProps, ReactNode } from "react";


type Props = {
} & HTMLProps<HTMLTextAreaElement>;

export default function StyledTextarea(props: Props): ReactNode {
  const pClassName = props.className || "";
  const {theme} = useTheme();

  return (
    <textarea
      {...props}
      {...theme("outline-bgc", "glyph-c", pClassName)}
    />
  );
}
