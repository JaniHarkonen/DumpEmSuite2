import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { ChangeEvent, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import TagPanel from "@renderer/components/TagPanel/TagPanel";
import TableList, { TableListColumn, TableListDataCell } from "@renderer/components/TableList/TableList";
import { FilterationStepStock } from "@renderer/hook/useWorkspaceCompanies";
import FilterationControls from "@renderer/components/FilterationControls/FilterationControls";
import useFilterationStepStocks from "@renderer/hook/useFilterationStepStocks";
import useSelection, { SelectionID } from "@renderer/hook/useSelection";
import { Tag } from "src/shared/schemaConfig";


type OnCompanyListingSelect = (company: FilterationStepStock) => void;

type Props = {
  filterationStepID: string;
  onCompanySelect?: OnCompanyListingSelect;
};

export default function CompanyAnalysisList(props: Props): ReactNode {
  const pFilterationStepID: string = props.filterationStepID;
  const pOnCompanySelect: OnCompanyListingSelect = props.onCompanySelect || function(){ };

  const [tagFilters, setTagFilters] = useState<Tag[]>([]);

  const {
    stocks, 
    fetchFilterationStepStocks, 
    bringAllStocksToFilterationStep,
    delistStocks,
    postFilterationTagChange
  } = useFilterationStepStocks({
    filterationStepID: pFilterationStepID
  });

  const stockDataCells: TableListDataCell<FilterationStepStock>[] = 
    stocks.map((company: FilterationStepStock) => {
      return {
        id: company.company_id,
        data: company
      };
    }).filter((dataCell: TableListDataCell<FilterationStepStock>) => {
      return (
        tagFilters.length === 0 || 
        !!tagFilters.find((tag: Tag) => tag.tag_id === dataCell.data.tag_id)
      );
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

  const handleStockSelect = (
    dataCell: TableListDataCell<FilterationStepStock>, isChecked: boolean
  ) => {
    handleSelection(isChecked, ...[dataCell]);
  };

  const handleStockDelist = () => {
    delistStocks(...getSelectedIDs().map((id: SelectionID) => {
      return selectionSet[id].item.data.company_id.toString();
    }));
    resetSelection();
  };

  const handleToggleTag = (tag: Tag) => {
    const tagIndex: number = 
      tagFilters.findIndex((filterTag: Tag) => filterTag.tag_id === tag.tag_id);
    if( tagIndex < 0 ) {
      setTagFilters(tagFilters.concat(tag));
    } else {
      setTagFilters([
        ...tagFilters.slice(0, tagIndex),
        ...tagFilters.slice(tagIndex + 1)
      ]);
    }
  };

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
            <select
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                postFilterationTagChange(e.target.value, dataCell.data.company_id.toString());
              }}
              defaultValue={dataCell.data.tag_id}
            >
              <option value={"1"}>None</option>
              <option value={"2"}>Accepted</option>
              <option value={"3"}>Rejected</option>
              <option value={"6"}>Watch-list</option>
            </select>
          </>
        );
      }
    }
  ];


  return (
    <PageContainer>
      <PageHeader>Stocks</PageHeader>
      <FilterationControls
        onBringAll={bringAllStocksToFilterationStep}
        onDelist={handleStockDelist}
        onSelectAll={() => handleSelection(true, ...stockDataCells)}
        onDeselectAll={resetSelection}
      />
      <TagPanel onTagSelect={handleToggleTag} />
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
