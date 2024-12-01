import useWorkspaceComapanies, { CompanyWithCurrency } from "@renderer/hook/useWorkspaceCompanies";
import { ReactNode } from "react";
import TableList, { OnItemFocus, TableListColumn } from "../TableList/TableList";
import PageContainer from "../PageContainer/PageContainer";
import PageHeader from "../PageHeader/PageHeader";
import TagPanel from "../TagPanel/TagPanel";


const COLUMNS: TableListColumn<CompanyWithCurrency>[] = [
  { accessor: "company_name", caption: "Name" },
  { accessor: "stock_ticker", caption: "Ticker" },
  { accessor: "stock_price", caption: "Share price" },
  { accessor: "volume_price", caption: "Volume price" },
  { accessor: "volume_quantity", caption: "Volume quantity" }
];

type Props = {
  onCompanySelect?: OnItemFocus<CompanyWithCurrency>;
};

export default function CompanyAnalysisList(props: Props): ReactNode {
  const {companies} = useWorkspaceComapanies();


  return (
    <PageContainer>
      <PageHeader>Stocks</PageHeader>
      <TagPanel />
      <TableList<CompanyWithCurrency>
        onItemFocus={props.onCompanySelect}
        columns={COLUMNS}
        cells={companies.map((company: CompanyWithCurrency) => {
          return {
            id: company.company_id,
            data: company
          };
        })}
      />
    </PageContainer>
  );
}
