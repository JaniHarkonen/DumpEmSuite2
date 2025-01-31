import "./PageContainer.css";
import { HTMLProps, ReactNode } from "react";


export default function PageContainer(props: HTMLProps<HTMLDivElement>) {
  const pChildren: ReactNode[] | ReactNode = props.children;

  return (
    <div className="page-container">
      <div className="page-content-container">
        {pChildren}
      </div>
    </div>
  );
}
