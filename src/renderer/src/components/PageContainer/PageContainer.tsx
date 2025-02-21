import useSavedScrollBar from "@renderer/hook/useSavedScrollBar";
import "./PageContainer.css";
import { HTMLProps, MutableRefObject, ReactNode, useRef } from "react";


export default function PageContainer(props: HTMLProps<HTMLDivElement>) {
  const pChildren: ReactNode[] | ReactNode = props.children;
  const pageContainerRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
  const [handleScroll] = useSavedScrollBar({
    scrollBarID: "page-container",
    scrolledElementRef: pageContainerRef
  });

  return (
    <div
      className="page-container"
      ref={pageContainerRef}
      onScroll={handleScroll}
    >
      <div className="page-content-container">
        {pChildren}
      </div>
    </div>
  );
}
