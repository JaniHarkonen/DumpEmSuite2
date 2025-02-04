import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";


export type Position = {
  x: number;
  y: number;
};

type Returns = {
  isDragging: boolean;
  position: Position;
  offsetRef: MutableRefObject<Position>;
  startDragging: (offset?: Position) => void;
  stopDragging: () => void;
  setPosition: Dispatch<SetStateAction<Position>>;
};

export type UseDraggableElementsReturns = Returns;

export default function useDraggableElement(deps?: any[]): Returns {
  const [isDragging, setDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({x: 0, y: 0});
  
  const offsetRef: MutableRefObject<Position> = useRef<Position>({x: 0, y: 0});

  const startDragging = (offset?: Position) => {
    if( offset ) {
      offsetRef.current = offset;
    }

    setDragging(true);
  };

  const stopDragging = () => {
    setDragging(false);
  };

  useEffect(() => {
    const drag = (e: MouseEvent) => {
      if( isDragging ) {
        setPosition({
          x: e.clientX - offsetRef.current.x, 
          y: e.clientY - offsetRef.current.y
        });
      }
    };

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDragging);

    return () => {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDragging);
    };
  }, [isDragging, ...(deps || [])]);
  
  return {
    isDragging,
    position,
    offsetRef,
    setPosition,
    startDragging,
    stopDragging
  };
}
