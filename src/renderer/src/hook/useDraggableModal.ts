import { MouseEvent, MutableRefObject, useEffect } from "react";
import useDraggableElement, { Position, UseDraggableElementsReturns } from "./useDraggableElement";
import clamp from "@renderer/utils/clamp";


type PositionStyle = {
  left: string;
  top: string;
}

type Props = {
  modalRef: MutableRefObject<HTMLDivElement | null>;
};

type Returns = {
  handleDrag: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
  positionStyle: () => PositionStyle;
} & UseDraggableElementsReturns;

export default function useDraggableModal(props: Props): Returns {
  const pModalRef: MutableRefObject<HTMLDivElement | null> = props.modalRef;

  const {
    isDragging, position, offsetRef, startDragging, stopDragging, setPosition
  } = useDraggableElement([]);

  useEffect(() => {
    const bbox: DOMRect | undefined = pModalRef.current?.getBoundingClientRect();

    setPosition({
      x: window.innerWidth / 2 - ((bbox?.width ?? 0) / 2), 
      y: window.innerHeight / 2 - ((bbox?.height ?? 0) / 2)
    });

    const resize = (e: UIEvent) => {
      const ww: number = (e.target as Window).innerWidth;
      const wh: number = (e.target as Window).innerHeight;
      const bbox: DOMRect | undefined = pModalRef.current?.getBoundingClientRect();

      if( bbox ) {
        setPosition((prev: Position) => {
          return {
            x: Math.min(ww - bbox.width, prev.x),
            y: Math.min(wh - bbox.height, prev.y),
          };
        });
      }
    };

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleDrag = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const {x, y} = e.currentTarget.getBoundingClientRect();

    startDragging({
      x: e.pageX - x, 
      y: e.pageY - y
    });
  };

  const positionStyle = () => {
    const bbox: DOMRect | undefined = pModalRef.current?.getBoundingClientRect();
    let mw: number = 0;
    let mh: number = 0;

    if( bbox ) {
      mw = bbox.width;
      mh = bbox.height;
    }

    return {
      left: clamp(0, position.x, window.innerWidth - mw) + "px",
      top: clamp(0, position.y, window.innerHeight - mh) + "px"
    };
  };

  return {
    isDragging, 
    position, 
    offsetRef, 
    startDragging, 
    stopDragging, 
    setPosition,
    handleDrag,
    positionStyle
  };
}
