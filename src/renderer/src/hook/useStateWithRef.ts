import { MutableRefObject, useRef, useState } from "react";


type Returns<T> = [MutableRefObject<T>, T, (value: T) => void];

export default function useStateAndRef<T>(defaultValue: T): Returns<T> {
  const [state, setState] = useState<T>(defaultValue);
  const ref: MutableRefObject<T> = useRef<T>(defaultValue);

  const handleSetState = (value: T) => {
    ref.current = value;
    setState(value);
  };

  return [ref, state, handleSetState];
}
