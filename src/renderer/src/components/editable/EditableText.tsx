import { ReactNode } from "react";
import EditableComponent, { EditableComponentProps } from "./EditableComponent";
import StyledInput from "../StyledInput/StyledInput";


type Props = Omit<EditableComponentProps, "controlledElement">;

export default function EditableText(props: Props): ReactNode {
  const renderInput = (props: any): ReactNode => {
    return <StyledInput className="w-100" {...props} />;
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
