import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { ReactNode, useEffect } from "react";
import TagPanel from "@renderer/components/TagPanel/TagPanel";
import TableList, { TableListColumn, TableListDataCell } from "@renderer/components/TableList/TableList";
import { FilterationStepStock } from "@renderer/hook/useWorkspaceCompanies";
import FilterationControls from "@renderer/components/FilterationControls/FilterationControls";
import useFilterationStepStocks from "@renderer/hook/useFilterationStepStocks";
import useSelection, { SelectionID } from "@renderer/hook/useSelection";


const COLUMNS: TableListColumn<FilterationStepStock>[] = [
  { accessor: "company_name", caption: "Name" },
  { accessor: "stock_ticker", caption: "Ticker" },
  { accessor: "stock_price", caption: "Share price" },
  { accessor: "volume_price", caption: "Volume price" },
  { accessor: "volume_quantity", caption: "Volume quantity" },
  { 
    accessor: "tag_hex", 
    caption: "Verdict",
    ElementConstructor: (
      dataCell: TableListDataCell<FilterationStepStock>, 
      column: TableListColumn<FilterationStepStock>, 
      index: number
    ) => {
      return (
        <>
          <span
            className="size-tiny-icon mr-norm"
            style={{ backgroundColor: dataCell.data.tag_hex }}
          />
          <select>
            <option>None</option>
            <option>Accepted</option>
            <option>Rejected</option>
            <option>Watch-list</option>
          </select>
        </>
      );
    }
  }
];

type OnCompanyListingSelect = (company: FilterationStepStock) => void;

type Props = {
  filterationStepID: string;
  onCompanySelect?: OnCompanyListingSelect;
};

export default function CompanyAnalysisList(props: Props): ReactNode {
  const pFilterationStepID: string = props.filterationStepID;
  const pOnCompanySelect: OnCompanyListingSelect = props.onCompanySelect || function(){ };

  const {
    stocks, 
    fetchFilterationStepStocks, 
    bringAllStocksToFilterationStep,
    delistStocks
  } = useFilterationStepStocks({
    filterationStepID: pFilterationStepID
  });

  const stockDataCells: TableListDataCell<FilterationStepStock>[] = 
    stocks.map((company: FilterationStepStock) => {
      return {
        id: company.company_id,
        data: company
      };
    });

  const {
    selectionSet,
    handleSelection,
    getSelectedIDs,
    resetSelection
  } = useSelection<FilterationStepStock>({});
  
  useEffect(() => {
    fetchFilterationStepStocks();
  }, []);

  const handleStockFocus = (dataCell: TableListDataCell<FilterationStepStock>) => {
    pOnCompanySelect(dataCell.data);
  };

  const handleStockSelect = (dataCell: TableListDataCell<FilterationStepStock>, isChecked: boolean) => {
    handleSelection(isChecked, ...[dataCell]);
  };

  const handleStockDelist = () => {
    delistStocks(...getSelectedIDs().map((id: SelectionID) => selectionSet[id].item.data.company_id.toString()));
  };


  return (
    <PageContainer>
      <PageHeader>Stocks</PageHeader>
      <FilterationControls
        onBringAll={bringAllStocksToFilterationStep}
        onDelist={handleStockDelist}
        onSelectAll={() => handleSelection(true, ...stockDataCells)}
        onDeselectAll={resetSelection}
      />
      <TagPanel />
      <TableList<FilterationStepStock>
        onItemFocus={handleStockFocus}
        columns={COLUMNS}
        cells={stockDataCells}
        allowSelection={true}
        selectionSet={selectionSet}
        onItemSelect={handleStockSelect}
      />
    </PageContainer>
  );
}
