import "./Panel.css";
import useTheme from "@renderer/hook/useTheme";

import { HTMLProps, ReactNode } from "react";


export default function Panel(props: HTMLProps<HTMLDivElement>): ReactNode {
  const pChildren: ReactNode = props.children;
  const pClassName: string = props.className || "";
  const {theme} = useTheme();

  return (
    <div {...theme("ambient-bgc", "panel-container", pClassName)}>
      {pChildren}
    </div>
  );
}