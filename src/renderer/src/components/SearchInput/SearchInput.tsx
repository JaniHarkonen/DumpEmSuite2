import { ReactNode } from "react";
import StyledInput, { StyledInputProps } from "../StyledInput/StyledInput";
import StyledIcon from "../StyledIcon/StyledIcon";
import { ASSETS } from "@renderer/assets/assets";


export default function SearchInput(props: StyledInputProps): ReactNode {
  return (
    <div className="d-flex d-align-items-center overflow-hidden">
      <StyledIcon
        className="p-absolute ml-medium-length" 
        src={ASSETS.icons.action.magnifyingGlass.black}
      />
      <StyledInput
        {...props} className={props.className + " pl-small-size"}
      />
    </div>
  );
}
