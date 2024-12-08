import TableList, { TableListColumn, TableListDataCell } from "../TableList/TableList";
import { ReactNode } from "react";
import { Company } from "src/shared/schemaConfig";


export type OnCompanyListingSelect<T> = (company: Company & T) => void;

export type SelectCompanyListingProps<T> = {
  onCompanySelect?: OnCompanyListingSelect<T>;
};

type Props<T> = {
  companies: (Company & T)[];
  columns: TableListColumn<Company & T>[];
} & SelectCompanyListingProps<T>;

export default function CompanyList<T>(props: Props<T>): ReactNode {
  const pCompanies: (Company & T)[] = props.companies;
  const pColumns: TableListColumn<Company & T>[] = props.columns;
  const pOnCompanySelect: OnCompanyListingSelect<T> = props.onCompanySelect || function(){ };

  const handleCompanySelection = (dataCell: TableListDataCell<Company & T>) => {
    pOnCompanySelect(dataCell.data);
  };


  return (
    <TableList<Company & T>
      onItemFocus={handleCompanySelection}
      columns={pColumns}
      cells={pCompanies.map((company: Company & T) => {
        return {
          id: company.company_id,
          data: company
        };
      })}
    />
  );
}
