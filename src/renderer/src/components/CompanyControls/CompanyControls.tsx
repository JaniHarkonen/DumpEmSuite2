import { ChangeEvent, ReactNode, useState } from "react";
import { Company } from "src/shared/schemaConfig";
import { AsString } from "src/shared/utils";
import { COMPANIES_LIST_COLUMNS } from "../TableList/WorkspaceCompaniesList/WorkspaceCompaniesList";
import { TableListColumn } from "../TableList/TableList";
import { CompanyWithCurrency } from "@renderer/hook/useWorkspaceCompanies";


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
    chart_url: "",
    updated: ""
  });

  return (
    <>
      <div className="d-flex">
        <button onClick={() => setDisplayAddControls(!displayAddControls)}>Add</button>
        <button onClick={() => pOnRemove()}>Remove</button>
        <button onClick={() => pOnSelectAll()}>Select all</button>
        <button onClick={() => pOnDeselectAll()}>De-select all</button>
        <button onClick={() => pOnImport()}>Import</button>
      </div>
      {displayAddControls && (
        <div className="d-flex">
          <button onClick={() => pOnAdd(addCandidateCompany)}>Add</button>
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
