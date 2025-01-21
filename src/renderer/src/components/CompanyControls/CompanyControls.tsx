import "./CompanyControls.css";

import { ChangeEvent, ReactNode, useState } from "react";
import StyledButton from "../StyledButton/StyledButton";
import { ASSETS } from "@renderer/assets/assets";
import CompanyAddPanel, { OnAddCompany } from "../CompanyAddPanel/CompanyAddPanel";


type DefaultCallback = () => void;

type Props = {
  onAdd?: OnAddCompany;
  onRemove?: DefaultCallback;
  onSelectAll?: DefaultCallback;
  onDeselectAll?: DefaultCallback;
  onImport?: DefaultCallback;
};

export default function CompanyControls(props: Props): ReactNode {
  const pOnAdd: OnAddCompany = props.onAdd || function(){ };
  const pOnRemove: DefaultCallback = props.onRemove || function(){ };
  const pOnSelectAll: DefaultCallback = props.onSelectAll || function(){ };
  const pOnDeselectAll: DefaultCallback = props.onDeselectAll || function(){ };
  const pOnImport: DefaultCallback = props.onImport || function(){ };

  const [displayAddControls, setDisplayAddControls] = useState<boolean>(false);

  const handleAllSelectionToggle = (e: ChangeEvent<HTMLInputElement>) => {
    if( e.target.checked ) {
      pOnSelectAll();
    } else {
      pOnDeselectAll();
    }
  };

  return (
    <div>
      <div className="mb-medium-length">
        <StyledButton
          className="mr-medium-length"
          onClick={() => setDisplayAddControls(!displayAddControls)}
        >
          {displayAddControls ? "Cancel" : "Add company"}
        </StyledButton>
        <StyledButton onClick={() => pOnRemove()}>Remove selected</StyledButton>
      </div>
      {displayAddControls && <CompanyAddPanel onAdd={pOnAdd} />}
      <div className="company-controls-secondary-control-container">
        <div>
          <input
            type="checkbox"
            onChange={handleAllSelectionToggle}
          />
          <span className="ml-strong-length">(De)select all</span>
        </div>
        <div></div>
        <StyledButton onClick={() => pOnImport()}>
          <span>Import</span>
          <img 
            className="size-tiny-icon ml-medium-length" 
            src={ASSETS.icons.buttons.import.black}
          />
        </StyledButton>
      </div>
    </div>
  );
}
