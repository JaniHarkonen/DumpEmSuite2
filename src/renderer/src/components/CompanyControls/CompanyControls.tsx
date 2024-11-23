import { ReactNode } from "react";


type Props = {
  onAdd?: () => void;
  onRemove?: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onImport?: () => void;
};

export default function CompanyControls(props: Props): ReactNode {
  return (
    <div className="d-flex">
      <button onClick={() => props.onAdd && props.onAdd()}>Add</button>
      <button onClick={() => props.onRemove && props.onRemove()}>Remove</button>
      <button onClick={() => props.onSelectAll && props.onSelectAll()}>Select all</button>
      <button onClick={() => props.onDeselectAll && props.onDeselectAll()}>De-select all</button>
      <button onClick={() => props.onImport && props.onImport()}>Import</button>
    </div>
  );
}
