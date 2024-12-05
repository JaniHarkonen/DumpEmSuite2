import useWorkspaceComapanies, { CompanyWithCurrency } from "@renderer/hook/useWorkspaceCompanies";
import TableList, { TableListColumn, TableListDataCell } from "../TableList/TableList";
import { ReactNode } from "react";


export type OnCompanyListingSelect = (company: CompanyWithCurrency) => void;

export type SelectCompanyListingProps = {
  onCompanySelect?: OnCompanyListingSelect;
};

type Props = {
  columns: TableListColumn<CompanyWithCurrency>[];
} & SelectCompanyListingProps;

export default function CompanyList(props: Props): ReactNode {
  const pColumns: TableListColumn<CompanyWithCurrency>[] = props.columns;
  const pOnCompanySelect: OnCompanyListingSelect = props.onCompanySelect || function(){ };

  const {companies} = useWorkspaceComapanies();

  const handleCompanySelection = (dataCell: TableListDataCell<CompanyWithCurrency>) => {
    pOnCompanySelect(dataCell.data);
  };


  return (
    <TableList<CompanyWithCurrency>
      onItemFocus={handleCompanySelection}
      columns={pColumns}
      cells={companies.map((company: CompanyWithCurrency) => {
        return {
          id: company.company_id,
          data: company
        };
      })}
    />
  );
}
