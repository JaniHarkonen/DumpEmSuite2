import useEditable, { OnEditFinalize } from "@renderer/hook/useEditable";
import { DetailedHTMLProps, FocusEvent, HTMLAttributes, KeyboardEvent, PropsWithChildren, ReactNode } from "react";


type ControlledElementRenderer = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
) => ReactNode;

type Props = {
  value: string;
  controlledElement: ControlledElementRenderer;
  onFinalize?: OnEditFinalize<string>;
  editDisabled?: boolean;
} & PropsWithChildren;

export type EditableComponentProps = Props;

export default function EditableComponent(props: Props): ReactNode {
  const pValue: string = props.value;
  const pControlledElement: ControlledElementRenderer = props.controlledElement;
  const pOnTextEditFinalize: OnEditFinalize<string> = props.onFinalize || function(){};
  const pEditDisabled: boolean = props.editDisabled ?? false;
  const pChildren: ReactNode[] | ReactNode = props.children;

  const [isEditing, handleEditStart, handleFinalize, handleEnter] = 
    useEditable<string>({ onFinalize: pOnTextEditFinalize });

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
          onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
            handleEnter(e.code, e.currentTarget.value);
          }
        })
      ) : (
        <div onDoubleClick={handleEditStart}>
           {pChildren}
        </div>
      )}
    </>
  );
}
