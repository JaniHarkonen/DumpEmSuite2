import { ReactNode } from "react";
import EditableComponent, { EditableComponentProps } from "./EditableComponent";
import StyledTextarea from "../StyledTextarea/StyledTextarea";


type Props = Omit<EditableComponentProps, "controlledElement">;

export default function EditableTextArea(props: Props): ReactNode {
  const renderTextArea = (props: any): ReactNode => {
    return (
      <StyledTextarea
        {...props}
        className="w-100"
      />
    );
  };

  return (
    <EditableComponent
      value={props.value}
      controlledElement={renderTextArea}
      onFinalize={props.onFinalize}
      editDisabled={props.editDisabled}
    >
      {props.value}
    </EditableComponent>
  );
}
