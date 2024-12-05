import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { ReactNode } from "react";
import CompanyList, { OnCompanyListingSelect, SelectCompanyListingProps } from "../CompanyList";
import TagPanel from "@renderer/components/TagPanel/TagPanel";
import { TableListColumn } from "@renderer/components/TableList/TableList";
import { CompanyWithCurrency } from "@renderer/hook/useWorkspaceCompanies";


const COLUMNS: TableListColumn<CompanyWithCurrency>[] = [
  { accessor: "company_name", caption: "Name" },
  { accessor: "stock_ticker", caption: "Ticker" },
  { accessor: "stock_price", caption: "Share price" },
  { accessor: "volume_price", caption: "Volume price" },
  { accessor: "volume_quantity", caption: "Volume quantity" }
];

export default function CompanyAnalysisList(props: SelectCompanyListingProps): ReactNode {
  const pOnCompanySelect: OnCompanyListingSelect | undefined = props.onCompanySelect;
  
  return (
    <PageContainer>
      <PageHeader>Stocks</PageHeader>
      <TagPanel />
      <CompanyList
        columns={COLUMNS}
        onCompanySelect={pOnCompanySelect}
      />
    </PageContainer>
  );
}
