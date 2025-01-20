import { ChangeEvent, ReactNode, useState } from "react";
import { Company } from "src/shared/schemaConfig";
import { AsString } from "src/shared/utils";
import { COMPANIES_LIST_COLUMNS } from "../WorkspaceCompaniesList/WorkspaceCompaniesList";
import { TableListColumn } from "../TableList/TableList";
import { CompanyWithCurrency } from "@renderer/hook/useWorkspaceCompanies";
import StyledButton from "../StyledButton/StyledButton";

type OnAddCompany = (company: AsString<Company>) => void;
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
  const [addCandidateCompany, setAddCandidateCompany] = useState<AsString<Company>>({
    company_id: "",
    company_name: "",
    stock_ticker: "",
    stock_price: "",
    volume_price: "",
    volume_quantity: "",
    exchange: "",
    updated: ""
  });

  return (
    <>
      <div className="d-flex">
        <StyledButton onClick={() => setDisplayAddControls(!displayAddControls)}>Add</StyledButton>
        <StyledButton onClick={() => pOnRemove()}>Remove</StyledButton>
        <StyledButton onClick={() => pOnSelectAll()}>Select all</StyledButton>
        <StyledButton onClick={() => pOnDeselectAll()}>De-select all</StyledButton>
        <StyledButton onClick={() => pOnImport()}>Import</StyledButton>
      </div>
      {displayAddControls && (
        <div className="d-flex">
          <StyledButton onClick={() => pOnAdd(addCandidateCompany)}>Add</StyledButton>
          {COMPANIES_LIST_COLUMNS.map((column: TableListColumn<CompanyWithCurrency>) => {
            const id: string = "companies-list-add-controls-input-" + column.accessor;
            return (
              <div key={id}>
                <label htmlFor={id}>{column.caption}</label>
                <input 
                  id={id} 
                  type="text"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setAddCandidateCompany({
                      ...addCandidateCompany,
                      [column.accessor]: e.target.value
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
