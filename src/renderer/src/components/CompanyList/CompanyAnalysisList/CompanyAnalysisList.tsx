
import "../../TagPanel/CompanyTag/CompanyTag.css";

import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { ChangeEvent, ReactNode, useContext, useEffect, useState } from "react";
import TagPanel from "@renderer/components/TagPanel/TagPanel";
import TableList, { TableListColumn, TableListDataCell } from "@renderer/components/TableList/TableList";
import { FilterationStepStock } from "@renderer/hook/useWorkspaceCompanies";
import FilterationControls from "@renderer/components/FilterationControls/FilterationControls";
import useFilterationStepStocks from "@renderer/hook/useFilterationStepStocks";
import useSelection, { SelectionID } from "@renderer/hook/useSelection";
import { FilterationStep, Tag } from "src/shared/schemaConfig";
import useFiltertionTags from "@renderer/hook/useFiltertionTags";
import FiltrationSubmitForm from "@renderer/components/FiltrationSubmitForm/FiltrationSubmitForm";
import useTabKeys from "@renderer/hook/useTabKeys";
import { TabsContext } from "@renderer/context/TabsContext";
import { Tab } from "@renderer/model/tabs";
import useSortedData, { SortSettings } from "@renderer/hook/useSortedData";
import { ProfileContext } from "@renderer/context/ProfileContext";
import { milleFormatter, priceFormatter } from "@renderer/utils/formatter";
import Panel from "@renderer/components/Panel/Panel";
import Container from "@renderer/components/Container/Container";
import arrayToOccurrenceMap from "@renderer/utils/arrayToOccurrenceMap";
import CompanyTag from "@renderer/components/TagPanel/CompanyTag/CompanyTag";
import checkIfHexBelowThreshold from "@renderer/utils/checkIfHexBelowThreshold";


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

  const {tabs, activeTabIndex, setExtraInfo} = useContext(TabsContext);
  
  const activeTab: Tab = tabs[activeTabIndex];

  const {
    sortedData, 
    sortField, 
    sortOrder, 
    sortBy
  } = useSortedData({
    initialOrder: stocks,
    fieldTypeMap: {
      company_name: "string",
      stock_ticker: "string",
      stock_price: "numeric",
      volume_price: "numeric",
      volume_quantity: "numeric"
    },
    sortField: activeTab?.extra?.sortField,
    sortOrder: activeTab?.extra?.sortOrder
  });

  const {company} = useContext(ProfileContext);

  const {formatKey} = useTabKeys();

  const handleSortToggle = (column: TableListColumn<FilterationStepStock>) => {
    const settings: SortSettings = sortBy(column.accessor);
    setExtraInfo && setExtraInfo({
      sortField: settings.sortField,
      sortOrder: settings.sortOrder
    });
  };
  
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
    { 
      accessor: "stock_price", 
      caption: "Share price", 
      formatter: (
        data: FilterationStepStock, dataCell: TableListDataCell<FilterationStepStock>
      ) => {
        return priceFormatter(dataCell.data.currency_symbol, "" + data.stock_price);
      }
    },
    { 
      accessor: "volume_price", 
      caption: "Currency volume",
      formatter: (
        data: FilterationStepStock, dataCell: TableListDataCell<FilterationStepStock>
      ) => {
        return priceFormatter(dataCell.data.currency_symbol, "" + data.volume_price);
      }
    },
    {
      accessor: "volume_quantity", 
      caption: "Volume",
      formatter: (data: FilterationStepStock) => {
        return milleFormatter("" + data.volume_quantity);
      }
    },
    { 
      accessor: "tag_hex", 
      caption: "Verdict",
      ElementConstructor: (dataCell: TableListDataCell<FilterationStepStock>) => {
        return (
          <div className="d-flex d-align-items-center h-100 w-100 p-relative d-justify-end">
            <span
              className="company-tag-color mr-medium-length"
              style={{
                backgroundColor: dataCell.data.tag_hex
              }}
            />
            <select
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                postFilterationTagChange(e.target.value, dataCell.data.company_id.toString());
              }}
              defaultValue={dataCell.data.tag_id}
              style={{
                color: checkIfHexBelowThreshold(dataCell.data.tag_hex, 100) ? "white" : "black",
                backgroundColor: dataCell.data.tag_hex
              }}
            >
              {tags.map((tag: Tag) => {
                return (
                  <option
                  className="test"
                    key={formatKey("datacell-tag-selection-" + dataCell.id + "-" + tag.tag_id)}
                    style={{
                      color: checkIfHexBelowThreshold(tag.tag_hex, 100) ? "white" : "black",
                      backgroundColor: tag.tag_hex
                    }}
                    value={tag.tag_id}
                  >
                    {tag.tag_label}
                  </option>
                );
              })}
            </select>
          </div>
        );
      }
    }
  ];

  const stockDataCells: TableListDataCell<FilterationStepStock>[] = 
    sortedData.map((c: FilterationStepStock) => {
      return {
        id: c.company_id,
        data: c,
        hasHighlight: (company?.company_id === c.company_id)
      };
    }).filter((dataCell: TableListDataCell<FilterationStepStock>) => {
        // Hide stocks that do not satisfy the filter criteria
      return (
        tagFilters.length === 0 || 
        !!tagFilters.find((tag: Tag) => tag.tag_id === dataCell.data.tag_id)
      );
    });

    // Determine which column is being sorted, and assign its sort order
  const stockDataColumns: TableListColumn<FilterationStepStock>[] = 
    COLUMNS.map((column: TableListColumn<FilterationStepStock>) => {
      return {
        ...column,
        ...(sortField === column.accessor ? { sortOrder } : {})
      };
    });

  return (
    <PageContainer>
      <PageHeader>Stocks</PageHeader>
      <Panel className="d-flex mb-medium-length">
        <div className="w-100">
          <FilterationControls
            onBringAll={bringAllStocksToFilterationStep}
            onDelist={handleStockDelist}
            onSelectAll={() => handleSelection(true, ...stockDataCells)}
            onDeselectAll={resetSelection}
          />
        </div>
        {pAllowSubmit && (
          <div className="d-flex d-justify-end w-100">
            <FiltrationSubmitForm
              blackListedMap={{[pFilterationStepID]: true}}
              onSubmit={handleStockSubmission}
            />
          </div>
        )}
      </Panel>
      <div>
        <h3>Filters</h3>
        <Container>
          <TagPanel
            onTagSelect={handleToggleTag}
            selectedTagMap={
              arrayToOccurrenceMap<Tag>(tagFilters, (tag: Tag) => tag.tag_id.toString())
            }
          />
        </Container>
      </div>
      <TableList<FilterationStepStock>
        onItemFocus={handleStockFocus}
        columns={stockDataColumns}
        cells={stockDataCells}
        allowSelection={true}
        selectionSet={selectionSet}
        onItemSelect={handleStockSelect}
        onColumnSelect={handleSortToggle}
      />
    </PageContainer>
  );
}
