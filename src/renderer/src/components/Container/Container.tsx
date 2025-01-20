import { PropsWithChildren, ReactNode } from "react";


export default function Container(props: PropsWithChildren): ReactNode {
  return (
    <div className="indent-small-size">
      {props.children}
    </div>
  );
}
