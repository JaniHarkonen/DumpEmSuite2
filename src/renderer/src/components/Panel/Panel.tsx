import useTheme from "@renderer/hook/useTheme";
import "./Panel.css";

import { HTMLProps, ReactNode } from "react";


export default function Panel(props: HTMLProps<HTMLDivElement>): ReactNode {
  const pChildren: ReactNode = props.children;
  const {theme} = useTheme();

  return (
    <div {...theme("ambient-bgc", "panel-container")}>
      {pChildren}
    </div>
  );
}