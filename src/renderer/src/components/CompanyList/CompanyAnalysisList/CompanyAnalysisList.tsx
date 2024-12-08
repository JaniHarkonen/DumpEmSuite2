import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { ReactNode, useEffect } from "react";
import TagPanel from "@renderer/components/TagPanel/TagPanel";
import TableList, { TableListColumn, TableListDataCell } from "@renderer/components/TableList/TableList";
import { CompanyWithCurrency } from "@renderer/hook/useWorkspaceCompanies";
import FilterationControls from "@renderer/components/FilterationControls/FilterationControls";
import useFilterationStepStocks from "@renderer/hook/useFilterationStepStocks";


const COLUMNS: TableListColumn<CompanyWithCurrency>[] = [
  { accessor: "company_name", caption: "Name" },
  { accessor: "stock_ticker", caption: "Ticker" },
  { accessor: "stock_price", caption: "Share price" },
  { accessor: "volume_price", caption: "Volume price" },
  { accessor: "volume_quantity", caption: "Volume quantity" }
];

type OnCompanyListingSelect = (company: CompanyWithCurrency) => void;

type Props = {
  filterationStepID: string;
  onCompanySelect?: OnCompanyListingSelect;
};

export default function CompanyAnalysisList(props: Props): ReactNode {
  const pFilterationStepID: string = props.filterationStepID;
  const pOnCompanySelect: OnCompanyListingSelect = props.onCompanySelect || function(){ };

  const {stocks, fetchFilterationStepCompanies} = useFilterationStepStocks();
  
  useEffect(() => {
    fetchFilterationStepCompanies(pFilterationStepID);
  }, []);

  const handleCompanySelection = (dataCell: TableListDataCell<CompanyWithCurrency>) => {
    pOnCompanySelect(dataCell.data);
  };


  return (
    <PageContainer>
      <PageHeader>Stocks</PageHeader>
      <FilterationControls />
      <TagPanel />
      <TableList<CompanyWithCurrency>
        onItemFocus={handleCompanySelection}
        columns={COLUMNS}
        cells={stocks.map((company: CompanyWithCurrency) => {
          return {
            id: company.company_id,
            data: company
          };
        })}
      />
    </PageContainer>
  );
}
