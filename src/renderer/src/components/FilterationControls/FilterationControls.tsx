import { ReactNode } from "react";
import StyledButton from "../StyledButton/StyledButton";


type Props = {
  onBringAll?: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onDelist?: () => void;
};

export default function FilterationControls(props: Props): ReactNode {
  const pOnBringAll: () => void = props.onBringAll || function(){ };
  const pSelectAll: () => void = props.onSelectAll || function(){ };
  const pOnDeselectAll: () => void = props.onDeselectAll || function(){ };
  const pOnDelist: () => void = props.onDelist || function(){ };


  return(
    <div>
      <StyledButton onClick={pOnBringAll}>Bring all companies</StyledButton>
      <StyledButton onClick={pOnDelist}>De-list</StyledButton>
      <StyledButton onClick={pSelectAll}>Select all</StyledButton>
      <StyledButton onClick={pOnDeselectAll}>De-select all</StyledButton>
    </div>
  );
}
