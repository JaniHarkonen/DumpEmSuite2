import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import TagPanel from "@renderer/components/TagPanel/TagPanel";
import TableList, { TableListColumn, TableListDataCell } from "@renderer/components/TableList/TableList";
import { FilterationStepStock } from "@renderer/hook/useWorkspaceCompanies";
import FilterationControls from "@renderer/components/FilterationControls/FilterationControls";
import useFilterationStepStocks from "@renderer/hook/useFilterationStepStocks";
import useSelection, { SelectionID } from "@renderer/hook/useSelection";
import { FilterationStep, Tag } from "src/shared/schemaConfig";
import useFiltertionTags from "@renderer/hook/useFiltertionTags";
import FiltrationSubmitForm from "@renderer/components/FiltrationSubmitForm/FiltrationSubmitForm";


type OnCompanyListingSelect = (company: FilterationStepStock) => void;

type Props = {
  filterationStepID: string;
  allowSubmit?: boolean;
  onCompanySelect?: OnCompanyListingSelect;
};

export default function CompanyAnalysisList(props: Props): ReactNode {
  const pFilterationStepID: string = props.filterationStepID;
  const pAllowSubmit: boolean = props.allowSubmit ?? false;
  const pOnCompanySelect: OnCompanyListingSelect = props.onCompanySelect || function(){ };

  const [tagFilters, setTagFilters] = useState<Tag[]>([]);

  const {
    selectionSet,
    handleSelection,
    getSelectedIDs,
    resetSelection
  } = useSelection<FilterationStepStock>({});

  const {tags, fetchAllTags} = useFiltertionTags();

  const {
    stocks, 
    fetchFilterationStepStocks, 
    bringAllStocksToFilterationStep,
    delistStocks,
    postFilterationTagChange,
    postStocksToFilterationStep
  } = useFilterationStepStocks({
    filterationStepID: pFilterationStepID,
    defaultTagID: 1
  });

  const stockDataCells: TableListDataCell<FilterationStepStock>[] = 
    stocks.map((company: FilterationStepStock) => {
      return {
        id: company.company_id,
        data: company
      };
    }).filter((dataCell: TableListDataCell<FilterationStepStock>) => {
        // Hide stocks that do not satisfy the filter criteria
      return (
        tagFilters.length === 0 || 
        !!tagFilters.find((tag: Tag) => tag.tag_id === dataCell.data.tag_id)
      );
    });
  
  useEffect(() => {
    fetchFilterationStepStocks();
    fetchAllTags();
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
    const tagIndex: number = tagFilters.findIndex((filterTag: Tag) => {
      return( filterTag.tag_id === tag.tag_id );
    });

      // Turn filter ON
    if( tagIndex < 0 ) {
      setTagFilters(tagFilters.concat(tag));
    } else {
        // Turn filter OFF
      setTagFilters([
        ...tagFilters.slice(0, tagIndex),
        ...tagFilters.slice(tagIndex + 1)
      ]);
    }
  };

  const handleStockSubmission = (targetStep: FilterationStep, preserveTags: boolean) => {
    postStocksToFilterationStep(
      targetStep.step_id,
      [...getSelectedIDs().map((id: SelectionID) => id.toString())],
      preserveTags
    );
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
              {tags.map((tag: Tag) => {
                return (
                  <option
                    key={"datacell-tag-selection-" + dataCell.id}
                    value={tag.tag_id}
                  >
                    {tag.tag_label}
                  </option>
                )
              })}
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
      {pAllowSubmit && (
        <FiltrationSubmitForm
          blackListedMap={{[pFilterationStepID]: true}}
          onSubmit={handleStockSubmission}
        />
      )}
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
