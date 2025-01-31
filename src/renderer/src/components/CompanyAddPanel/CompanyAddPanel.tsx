import { ChangeEvent, ReactNode, useState } from "react";
import { COMPANIES_LIST_COLUMNS } from "../WorkspaceCompaniesList/WorkspaceCompaniesList";
import { TableListColumn } from "../TableList/TableList";
import { CompanyWithCurrency } from "@renderer/hook/useWorkspaceCompanies";
import useTabKeys from "@renderer/hook/useTabKeys";
import StyledInput from "../StyledInput/StyledInput";
import { AsString } from "src/shared/utils";
import { Company } from "src/shared/schemaConfig";
import StyledButton from "../StyledButton/StyledButton";
import Panel from "../Panel/Panel";

export type OnAddCompany = (company: AsString<Company>) => void;

type Props = {
  onAdd?: OnAddCompany;
};

export default function CompanyAddPanel(props: Props): ReactNode {
  const pOnAdd: OnAddCompany = props.onAdd || function(){ };
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

  const {formatKey} = useTabKeys();

  return (
    <Panel>
      {COMPANIES_LIST_COLUMNS.map((column: TableListColumn<CompanyWithCurrency>) => {
        const id: string = formatKey("companies-list-add-controls-input-" + column.accessor);
        return (
          <div key={id}>
            <label htmlFor={id}>{column.caption}:</label>
            <StyledInput
              className="w-100"
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
      <div className="mt-strong-length">
        <StyledButton onClick={() => pOnAdd(addCandidateCompany)}>Add</StyledButton>
      </div>
    </Panel>
  );
}
