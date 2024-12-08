import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { ReactNode, useEffect } from "react";
import CompanyList, { OnCompanyListingSelect, SelectCompanyListingProps } from "../CompanyList";
import TagPanel from "@renderer/components/TagPanel/TagPanel";
import { TableListColumn } from "@renderer/components/TableList/TableList";
import { CompanyWithCurrency } from "@renderer/hook/useWorkspaceCompanies";
import FilterationControls from "@renderer/components/FilterationControls/FilterationControls";
import { Currency } from "src/shared/schemaConfig";
import useFilterationStepStocks from "@renderer/hook/useFilterationStepStocks";


const COLUMNS: TableListColumn<CompanyWithCurrency>[] = [
  { accessor: "company_name", caption: "Name" },
  { accessor: "stock_ticker", caption: "Ticker" },
  { accessor: "stock_price", caption: "Share price" },
  { accessor: "volume_price", caption: "Volume price" },
  { accessor: "volume_quantity", caption: "Volume quantity" }
];

type Props = {
  filterationStepID: string;
} & SelectCompanyListingProps<Currency>;

export default function CompanyAnalysisList(props: Props): ReactNode {
  const pFilterationStepID: string = props.filterationStepID;
  const pOnCompanySelect: OnCompanyListingSelect<Currency> | undefined = props.onCompanySelect;

  const {stocks, fetchFilterationStepCompanies} = useFilterationStepStocks();
  
  useEffect(() => {
    fetchFilterationStepCompanies(pFilterationStepID);
  }, []);

  return (
    <PageContainer>
      <PageHeader>Stocks</PageHeader>
      <FilterationControls />
      <TagPanel />
      <CompanyList<Currency>
        companies={stocks}
        columns={COLUMNS}
        onCompanySelect={pOnCompanySelect}
      />
    </PageContainer>
  );
}
