import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { ReactNode } from "react";
import CompanyList, { OnCompanyListingSelect, SelectCompanyListingProps } from "../CompanyList";
import { CompanyWithCurrency } from "@renderer/hook/useWorkspaceCompanies";
import { TableListColumn } from "@renderer/components/TableList/TableList";


const COLUMNS: TableListColumn<CompanyWithCurrency>[] = [
  { accessor: "company_name", caption: "Name" },
  { accessor: "stock_ticker", caption: "Ticker" },
  { accessor: "updated", caption: "Updated" }
];

export default function CompanyProfilesList(props: SelectCompanyListingProps): ReactNode {
  const pOnCompanySelect: OnCompanyListingSelect | undefined = props.onCompanySelect;
  
  return (
    <PageContainer>
      <PageHeader>Profiles</PageHeader>
      <CompanyList
        columns={COLUMNS}
        onCompanySelect={pOnCompanySelect}
      />
    </PageContainer>
  );
}
