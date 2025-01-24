import "./Container.css";
import useTheme from "@renderer/hook/useTheme";

import { HTMLProps, ReactNode } from "react";


export default function Container(props: HTMLProps<HTMLDivElement>): ReactNode {
  const pChildren: ReactNode = props.children;
  const pClassName: string = props.className || "";
  const {theme} = useTheme();

  return (
    <div
      {...props}
      {...theme("script-c", "indent-small-size " + pClassName)}
    >
      {pChildren}
      <div className="container-footer-pad" />
    </div>
  );
}
