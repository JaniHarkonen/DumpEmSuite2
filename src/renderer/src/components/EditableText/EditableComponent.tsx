import { DetailedHTMLProps, FocusEvent, HTMLAttributes, KeyboardEvent, PropsWithChildren, ReactNode, useState } from "react";


export type OnEditFinalize = (value: string) => void;
type ControlledElementRenderer = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
) => ReactNode;

type Props = {
  value: string;
  controlledElement: ControlledElementRenderer;
  onFinalize?: OnEditFinalize;
  editDisabled?: boolean;
} & PropsWithChildren;

export type EditableComponentProps = Props;

export default function EditableComponent(props: Props): ReactNode {
  const pValue: string = props.value;
  const pControlledElement: ControlledElementRenderer = props.controlledElement;
  const pOnTextEditFinalize: OnEditFinalize = props.onFinalize || function(){};
  const pEditDisabled: boolean = props.editDisabled || false;
  const pChildren: ReactNode[] | ReactNode = props.children;

  const [isEditing, setEditing] = useState<boolean>(false);

  const handleFinalize = (value: string) => {
    pOnTextEditFinalize(value);
    setEditing(false);
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if( e.code === "Enter" ) {
      handleFinalize(e.currentTarget.value);
    }
  };

  if( pEditDisabled ) {
    return pChildren;
  }

  return (
    <>
      {isEditing ? (
        pControlledElement({
          defaultValue: pValue,
          onBlur: (e: FocusEvent<HTMLInputElement>) => handleFinalize(e.target.value),
          autoFocus: true,
          onKeyDown: handleEnter
        })
      ) : (
        <div onDoubleClick={() => setEditing(true)}>
           {pChildren}
        </div>
      )}
    </>
  );
}
