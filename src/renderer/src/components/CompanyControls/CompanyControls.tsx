import "./CompanyControls.css";

import { ChangeEvent, ReactNode, useContext, useState } from "react";
import StyledButton from "../StyledButton/StyledButton";
import { ASSETS } from "@renderer/assets/assets";
import CompanyAddPanel, { OnAddCompany } from "../CompanyAddPanel/CompanyAddPanel";
import { ModalContext } from "@renderer/context/ModalContext";
import YesNoModal from "@renderer/layouts/modals/YesNoModal/YesNoModal";
import StyledInput from "../StyledInput/StyledInput";


type DefaultCallback = () => void;

type Props = {
  onAdd?: OnAddCompany;
  onRemove?: DefaultCallback;
  onSelectAll?: DefaultCallback;
  onDeselectAll?: DefaultCallback;
  onImport?: DefaultCallback;
  onUpdate?: DefaultCallback;
};

export default function CompanyControls(props: Props): ReactNode {
  const pOnAdd: OnAddCompany = props.onAdd || function(){ };
  const pOnRemove: DefaultCallback = props.onRemove || function(){ };
  const pOnSelectAll: DefaultCallback = props.onSelectAll || function(){ };
  const pOnDeselectAll: DefaultCallback = props.onDeselectAll || function(){ };
  const pOnImport: DefaultCallback = props.onImport || function(){ };
  const pOnUpdate: DefaultCallback = props.onImport || function(){ };

  const [displayAddControls, setDisplayAddControls] = useState<boolean>(false);

  const {openModal, closeModal} = useContext(ModalContext);

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
        <StyledButton onClick={() => {
          openModal(
            <YesNoModal onYes={() => {
              pOnRemove();
              closeModal();
            }}>
              Are you sure you want to remove all the selected companies?
            </YesNoModal>
          );
        }}>
          Remove selected
        </StyledButton>
      </div>
      {displayAddControls && <CompanyAddPanel onAdd={pOnAdd} />}
      <div className="company-controls-secondary-control-container">
        <div>
          <StyledInput
            type="checkbox"
            onChange={handleAllSelectionToggle}
          />
          <span className="ml-strong-length">(De)select all</span>
        </div>
        <div></div>
        <StyledButton
          onClick={() => pOnImport()}
          icon={ASSETS.icons.action.import.black}
        >
          Import
        </StyledButton>
      </div>
      <div className="company-controls-secondary-control-container">
        <div />
        <div />
        <StyledButton
          onClick={() => pOnUpdate()}
          icon={ASSETS.icons.action.import.black}
        >
          Update
        </StyledButton>
      </div>
    </div>
  );
}
