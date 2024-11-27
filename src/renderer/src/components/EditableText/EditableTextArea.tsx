import { ReactNode } from "react";
import EditableComponent, { EditableComponentProps } from "./EditableComponent";


type Props = Omit<EditableComponentProps, "controlledElement">;

export default function EditableTextArea(props: Props): ReactNode {
  const renderTextArea = (props: any): ReactNode => {
    return (
      <textarea
        {...props}
        className="w-100"
      />
    );
  };

  return (
    <EditableComponent
      value={props.value}
      controlledElement={renderTextArea}
      onFinalize={() => {}}
      editDisabled={props.editDisabled}
    >
      {props.value}
    </EditableComponent>
  );
}
