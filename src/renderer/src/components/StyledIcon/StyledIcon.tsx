import { HTMLProps, ReactNode } from "react";



export default function StyledIcon(props: HTMLProps<HTMLImageElement>): ReactNode {
  const pClassName: string = props.className || "";
  return (
    <img
      {...props}
      className={pClassName + " size-tiny-icon"}
    />
  );
}
