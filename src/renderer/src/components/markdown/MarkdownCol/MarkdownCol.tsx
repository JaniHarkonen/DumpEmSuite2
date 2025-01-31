import "./MarkdownCol.css";

import { PropsWithChildren, ReactNode } from "react";


export default function MarkdownCol(props: PropsWithChildren): ReactNode {
  const pChildren: ReactNode = props.children;

  return (
    <div className="markdown-col">
      {pChildren}
    </div>
  );
}
