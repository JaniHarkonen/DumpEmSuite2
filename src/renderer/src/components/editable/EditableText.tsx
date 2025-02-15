import { KeyboardEvent, ReactNode } from "react";
import EditableComponent, { EditableComponentProps } from "./EditableComponent";
import StyledInput from "../StyledInput/StyledInput";
import useHotkeys from "@renderer/hook/useHotkeys";


type Props = Omit<EditableComponentProps, "controlledElement">;

export default function EditableText(props: Props): ReactNode {
  const {hotkey} = useHotkeys();

  const renderInput = (props: any): ReactNode => {
    return (
      <StyledInput
        className="w-100" 
        {...props}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          e.stopPropagation();

          hotkey({
            "blur": (e: KeyboardEvent<HTMLElement>) => e.currentTarget.blur(),
            "finalize": (e: KeyboardEvent<HTMLElement>) => e.currentTarget.blur(),
          }).onKeyDown(e);
        }}
      />
    );
  };

  return (
    <EditableComponent
      value={props.value}
      controlledElement={renderInput}
      onFinalize={props.onFinalize}
      editDisabled={props.editDisabled}
    >
      {props.children}
    </EditableComponent>
  );
}
