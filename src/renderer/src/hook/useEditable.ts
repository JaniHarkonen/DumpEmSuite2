import { useState } from "react";


export type OnEditFinalize<T> = (value: T) => void;

type Props<T> = {
  onFinalize?: OnEditFinalize<T>;
};

type Returns<T> = [
  boolean,
  () => void,
  (value: T) => void,
  (code: string, value: T) => void
];

export default function useEditable<T>(props: Props<T>): Returns<T> {
  const [isEditing, setEditing] = useState<boolean>(false);
  const pOnTextEditFinalize: OnEditFinalize<T> = props.onFinalize || function(){};

  const handleEditStart = () => setEditing(true);

  const handleFinalize = (value: T) => {
    pOnTextEditFinalize(value);
    setEditing(false);
  };

  const handleEnter = (code: string, value: T) => {
    if( code === "Enter" ) {
      handleFinalize(value);
    }
  };

  return [
    isEditing,
    handleEditStart,
    handleFinalize,
    handleEnter
  ];
}
