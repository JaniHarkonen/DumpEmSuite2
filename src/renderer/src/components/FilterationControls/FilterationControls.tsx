import { ReactNode } from "react";


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
      <button onClick={pOnBringAll}>Bring all companies</button>
      <button onClick={pOnDelist}>De-list</button>
      <button onClick={pSelectAll}>Select all</button>
      <button onClick={pOnDeselectAll}>De-select all</button>
    </div>
  );
}
