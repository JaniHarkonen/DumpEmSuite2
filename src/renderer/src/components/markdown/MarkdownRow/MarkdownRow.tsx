import "./MarkdownRow.css";

import { PropsWithChildren, ReactNode } from "react";


export default function MarkdownRow(props: PropsWithChildren): ReactNode {
  const pChildren: ReactNode | ReactNode[] = props.children;
  return (
    <div className="markdown-row">
      <div className="markdown-row-content-container">
        {pChildren}
      </div>
    </div>
  );
}
