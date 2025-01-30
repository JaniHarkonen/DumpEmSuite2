import { HTMLProps, MouseEvent, ReactNode } from "react";


export default function StopDoubleClickPropagation(props: HTMLProps<HTMLDivElement>): ReactNode {
  return (
    <div
      {...props}
      onDoubleClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
      {props.children}
    </div>
  );
}