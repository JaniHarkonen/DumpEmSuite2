import { ReactNode } from "react";
import EditableComponent, { EditableComponentProps } from "./EditableComponent";


type Props = Omit<EditableComponentProps, "controlledElement">;

export default function EditableText(props: Props): ReactNode {
  const renderInput = (props: any): ReactNode => {
    return <input {...props} />;
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
