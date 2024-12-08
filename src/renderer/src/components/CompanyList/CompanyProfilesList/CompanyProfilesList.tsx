import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { ReactNode, useEffect } from "react";
import useWorkspaceComapanies from "@renderer/hook/useWorkspaceCompanies";
import TableList, { TableListColumn, TableListDataCell } from "@renderer/components/TableList/TableList";
import { Company } from "src/shared/schemaConfig";


const COLUMNS: TableListColumn<Company>[] = [
  { accessor: "company_name", caption: "Name" },
  { accessor: "stock_ticker", caption: "Ticker" },
  { accessor: "updated", caption: "Updated" }
];

type OnCompanyListingSelect = (company: Company) => void;

type Props = {
  onCompanySelect?: OnCompanyListingSelect;
};

export default function CompanyProfilesList(props: Props): ReactNode {
  const pOnCompanySelect: OnCompanyListingSelect = props.onCompanySelect || function(){ };
  const {companies, fetchAllCompanies} = useWorkspaceComapanies();
  
  useEffect(() => {
    fetchAllCompanies();
  }, []);

  const handleCompanySelection = (dataCell: TableListDataCell<Company>) => {
    pOnCompanySelect(dataCell.data);
  };


  return (
    <PageContainer>
      <PageHeader>Profiles</PageHeader>
      <TableList<Company>
        onItemFocus={handleCompanySelection}
        columns={COLUMNS}
        cells={companies.map((company: Company) => {
          return {
            id: company.company_id,
            data: company
          };
        })}
      />
    </PageContainer>
  );
}
