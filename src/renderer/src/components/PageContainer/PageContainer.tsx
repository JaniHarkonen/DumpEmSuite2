import "./PageContainer.css";
import { PropsWithChildren, ReactNode } from "react";


export default function PageContainer(props: PropsWithChildren) {
  const pChildren: ReactNode[] | ReactNode = props.children;

  return (
    <div className="page-container">
      <div className="page-content-container">
        {pChildren}
      </div>
    </div>
  );
}
