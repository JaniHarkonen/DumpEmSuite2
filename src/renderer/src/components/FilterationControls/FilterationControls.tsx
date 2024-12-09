import { ReactNode } from "react";


type Props = {
  onBringAll?: () => void;
};

export default function FilterationControls(props: Props): ReactNode {
  const pOnBringAll: () => void = props.onBringAll || function(){ };


  return(
    <div>
      <button onClick={pOnBringAll}>Bring all companies</button>
      <button>De-list</button>
      <button>Select all</button>
      <button>De-select all</button>
      <button>Submit</button>
    </div>
  );
}
