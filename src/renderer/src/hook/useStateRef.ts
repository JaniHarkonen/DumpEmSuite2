import { MutableRefObject, useRef, useState } from "react";

type Returns<T> = [T, (newState: T) => void, MutableRefObject<T>];

export default function useStateRef<T>(initialValue: T): Returns<T> {
  const [state, setState] = useState<T>(initialValue);
  const ref: MutableRefObject<T> = useRef<T>(initialValue);

  const handleSetState = (newState: T) => {
    setState(newState);
    ref.current = newState;
  };

  return [
    state, 
    handleSetState,
    ref
  ];
}
