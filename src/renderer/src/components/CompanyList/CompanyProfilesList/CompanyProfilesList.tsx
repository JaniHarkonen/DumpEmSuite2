import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { ReactNode, useEffect } from "react";
import CompanyList, { OnCompanyListingSelect, SelectCompanyListingProps } from "../CompanyList";
import useWorkspaceComapanies, { CompanyWithCurrency } from "@renderer/hook/useWorkspaceCompanies";
import { TableListColumn } from "@renderer/components/TableList/TableList";
import { Currency } from "src/shared/schemaConfig";


const COLUMNS: TableListColumn<CompanyWithCurrency>[] = [
  { accessor: "company_name", caption: "Name" },
  { accessor: "stock_ticker", caption: "Ticker" },
  { accessor: "updated", caption: "Updated" }
];

export default function CompanyProfilesList(props: SelectCompanyListingProps<Currency>): ReactNode {
  const pOnCompanySelect: OnCompanyListingSelect<Currency> | undefined = props.onCompanySelect;
  const {companies, fetchAllCompanies} = useWorkspaceComapanies();
  
  useEffect(() => {
    fetchAllCompanies();
  }, []);

  return (
    <PageContainer>
      <PageHeader>Profiles</PageHeader>
      <CompanyList<Currency>
        companies={companies}
        columns={COLUMNS}
        onCompanySelect={pOnCompanySelect}
      />
    </PageContainer>
  );
}
