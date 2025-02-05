import { DependencyList, MutableRefObject, useEffect, useRef, useState } from "react";

export type OnDrag = (e: MouseEvent) => void;

export type DraggableOffset = {
  x: number;
  y: number;
};

type Props = {
  onDrag: OnDrag;
};

type Returns = {
  isDragging: MutableRefObject<boolean>;
  handleDragStart: (offset?: DraggableOffset) => boolean;
  handleDragEnd: () => boolean;
  offset: DraggableOffset;
};

export default function useDraggable(props: Props, deps?: DependencyList): Returns {
  const pOnDrag: OnDrag = props.onDrag;
  const isDragging: MutableRefObject<boolean> = useRef(false);
  const [offset, setOffset] = useState<DraggableOffset>({ x: 0, y: 0 });

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

  const handleDragStart = (offset?: DraggableOffset) => {
    if( offset ) {
      setOffset(offset);
    }

    return (isDragging.current = true);
  };

  const handleDragEnd = () => isDragging.current = false;

  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
    offset
  };
}
