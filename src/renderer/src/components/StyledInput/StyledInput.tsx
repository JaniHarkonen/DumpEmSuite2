import "./StyledInput.css";
import useTheme from "@renderer/hook/useTheme";
import { HTMLProps, ReactNode } from "react";


export default function StyledInput(props: HTMLProps<HTMLInputElement>): ReactNode {
  const pClassName: string = props.className || "";
  const {theme} = useTheme();

  return (
    <input
      {...props}
      {...theme("baseline-bgc", "glyph-c", "line-height-standard",  pClassName)}
    />
  );
}
