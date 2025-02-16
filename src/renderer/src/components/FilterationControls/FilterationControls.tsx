import "./FilterationControls.css";

import { ReactNode, useContext } from "react";
import StyledButton from "../StyledButton/StyledButton";
import { ModalContext } from "@renderer/context/ModalContext";
import YesNoModal from "@renderer/layouts/modals/YesNoModal/YesNoModal";


type Props = {
  onBringAll?: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onDelist?: () => void;
  onSelectUntil?: () => void;
  onSelectAfter?: () => void;
};

export default function FilterationControls(props: Props): ReactNode {
  const pOnBringAll: () => void = props.onBringAll || function(){ };
  const pSelectAll: () => void = props.onSelectAll || function(){ };
  const pOnDeselectAll: () => void = props.onDeselectAll || function(){ };
  const pOnDelist: () => void = props.onDelist || function(){ };
  const pOnSelectUntil: () => void = props.onSelectUntil || function(){ };
  const pOnSelectAfter: () => void = props.onSelectAfter || function(){ };

  const {openModal} = useContext(ModalContext);

  return (
    <div className="filteration-controls-container">
      <StyledButton onClick={() => {
        openModal(
          <YesNoModal onYes={pOnBringAll}>
            <div>
              <div>
                Are you sure you want to bring all the available companies?
              </div>
              <div>
                This action will NOT erase the companies already in the list!
              </div>
            </div>
          </YesNoModal>
        );
      }}>
        Bring all companies
      </StyledButton>
      <StyledButton onClick={() => {
        openModal(
          <YesNoModal onYes={pOnDelist}>
            <div>
              <div>
                Are you sure you want to de-list the selected companies?
              </div>
              <div>
                The companies will be de-listed, however, they won't be removed completely.
              </div>
              <div>
                All analysis related to the filtration step will be removed!
              </div>
            </div>
          </YesNoModal>
        );
      }}>De-list</StyledButton>
      <StyledButton onClick={pSelectAll}>Select all</StyledButton>
      <StyledButton onClick={pOnDeselectAll}>De-select all</StyledButton>
      <StyledButton onClick={pOnSelectUntil}>Select until selected</StyledButton>
      <StyledButton onClick={pOnSelectAfter}>Select after selected</StyledButton>
    </div>
  );
}
