import "./Container.css";

import { HTMLProps, ReactNode } from "react";


export default function Container(props: HTMLProps<HTMLDivElement>): ReactNode {
  return (
    <div
      {...props}
      className={"indent-small-size " + props.className}
    >
      {props.children}
      <div className="container-footer-pad" />
    </div>
  );
}
