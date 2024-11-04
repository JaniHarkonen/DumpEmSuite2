import { DependencyList, MutableRefObject, useEffect, useRef } from "react";

export type OnDrag = (e: MouseEvent) => void;

type Props = {
  onDrag: OnDrag;
};

type Returns = {
  isDragging: MutableRefObject<boolean>;
  handleDragStart: () => boolean;
  handleDragEnd: () => boolean;
};

export default function useDraggable(props: Props, deps?: DependencyList): Returns {
  const pOnDrag: OnDrag = props.onDrag;
  const isDragging: MutableRefObject<boolean> = useRef(false);

  useEffect(() => {
    const dragEvent: OnDrag = (e: MouseEvent) => {
      if( !isDragging.current ) {
        return;
      }
      pOnDrag(e);
    };

    document.addEventListener("mousemove", dragEvent);
    document.addEventListener("mouseup", handleDragEnd);

    return () => {
      document.removeEventListener("mousemove", dragEvent);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, deps);

  const handleDragStart = () => isDragging.current = true;

  const handleDragEnd = () => isDragging.current = false;

  return {
    isDragging,
    handleDragStart,
    handleDragEnd
  };
}
