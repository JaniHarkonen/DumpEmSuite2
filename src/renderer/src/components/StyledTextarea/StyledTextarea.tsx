import "./StyledTextarea.css";
import useTheme from "@renderer/hook/useTheme";
import { HTMLProps, ReactNode } from "react";


export default function StyledTextarea(props: HTMLProps<HTMLTextAreaElement>): ReactNode {
  const pClassName = props.className || "";
  const {theme} = useTheme();

  return (
    <textarea
      {...props}
      {...theme("outline-bgc", "glyph-c", pClassName)}
    />
  );
}
