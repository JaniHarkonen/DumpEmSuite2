
import "../../TagPanel/CompanyTag/CompanyTag.css";

import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { ChangeEvent, KeyboardEvent, ReactNode, useContext, useEffect, useState } from "react";
import TagPanel from "@renderer/components/TagPanel/TagPanel";
import TableList, { TableListColumn, TableListDataCell } from "@renderer/components/TableList/TableList";
import { FilterationStepStock } from "@renderer/hook/useWorkspaceCompanies";
import FilterationControls from "@renderer/components/FilterationControls/FilterationControls";
import useFilterationStepStocks from "@renderer/hook/useFilterationStepStocks";
import useSelection, { SelectionID } from "@renderer/hook/useSelection";
import { FilterationStep, Tag } from "src/shared/schemaConfig";
import useFiltertionTags from "@renderer/hook/useFiltertionTags";
import FiltrationSubmitForm from "@renderer/components/FiltrationSubmitForm/FiltrationSubmitForm";
import { TabsContext } from "@renderer/context/TabsContext";
import { Tab } from "@renderer/model/tabs";
import useSortedData, { SortSettings } from "@renderer/hook/useSortedData";
import { ProfileContext } from "@renderer/context/ProfileContext";
import { milleFormatter, priceFormatter } from "@renderer/utils/formatter";
import Panel from "@renderer/components/Panel/Panel";
import Container from "@renderer/components/Container/Container";
import arrayToOccurrenceMap from "@renderer/utils/arrayToOccurrenceMap";
import CompanyListStatisticsPanel from "@renderer/components/CompanyListStatisticsPanel/CompanyListStatisticsPanel";
import FiltrationVerdictSelection from "@renderer/components/FiltrationVerdictSelection/FiltrationVerdictSelection";
import StyledInput from "@renderer/components/StyledInput/StyledInput";
import useViewEvents from "@renderer/hook/useViewEvents";
import useSearch from "@renderer/hook/useSearch";


type OnCompanyListingSelect = (company: FilterationStepStock | null) => void;

type Props = {
  filterationStepID: string;
  allowSubmit?: boolean;
  onCompanySelect?: OnCompanyListingSelect;
};

export default function CompanyAnalysisList(props: Props): ReactNode {
  const pFilterationStepID: string = props.filterationStepID;
  const pAllowSubmit: boolean = props.allowSubmit ?? false;
  const pOnCompanySelect: OnCompanyListingSelect = props.onCompanySelect || function(){ };

  const {
    selectionSet,
    handleSelection,
    handleSelectionUntil,
    handleSelectionAfter,
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
  const {subscribe, unsubscribe} = useViewEvents();

  const [tagFilters, setTagFilters] = useState<Tag[]>(activeTab?.extra?.tagFilters || []);
  const [sweepingVerdict, setSweepingVerdict] = 
    useState<boolean>(activeTab?.extra?.sweepingVerdict ?? false);

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

    const refresh = () => {
      fetchFilterationStepStocks();
      resetSelection();
    };

    subscribe("company-removed", refresh);
    subscribe("tags-changed", refresh);
    return () => {
      unsubscribe("company-removed", refresh);
      unsubscribe("tags-changed", refresh); 
    };
  }, []);

  const {
    searchCriteria,
    handleCriteriaChange,
    search
  } = useSearch();

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
    pOnCompanySelect(null);
  };

  const handleToggleTag = (tag: Tag) => {
    const tagIndex: number = tagFilters.findIndex((filterTag: Tag) => {
      return( filterTag.tag_id === tag.tag_id );
    });

    let newFilters: Tag[];

      // Turn filter ON
    if( tagIndex < 0 ) {
      newFilters = tagFilters.concat(tag);
      setTagFilters(newFilters);
    } else {
        // Turn filter OFF
      newFilters = [
        ...tagFilters.slice(0, tagIndex),
        ...tagFilters.slice(tagIndex + 1)
      ];
      setTagFilters(newFilters);
    }

    setExtraInfo({
      tagFilters: newFilters
    });
  };

  const handleStockSubmission = (targetStep: FilterationStep, preserveTags: boolean) => {
    postStocksToFilterationStep(
      targetStep.step_id,
      [...getSelectedIDs().map((id: SelectionID) => id.toString())],
      preserveTags
    );
  };

  const handleSweepingVerdict = (isON: boolean) => {
    setExtraInfo && setExtraInfo({ sweepingVerdict: isON });
    setSweepingVerdict(isON);
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
          <div
            className="d-flex d-align-items-center w-100 h-100 p-relative d-justify-end"
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <span
              className="company-tag-color mr-medium-length"
              style={{
                backgroundColor: dataCell.data.tag_hex
              }}
            />
            <FiltrationVerdictSelection
              tags={tags}
              selectedTag={{
                tag_id: dataCell.data.tag_id,
                tag_label: dataCell.data.tag_label,
                tag_hex: dataCell.data.tag_hex
              }}
              optionKeyPrefix={"datacell-tag-selection-" + dataCell.id + "-"}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                if( sweepingVerdict ) {
                  const ids: string[] = 
                    getSelectedIDs().map((selectionID: SelectionID) => "" + selectionID);
                  postFilterationTagChange(e.target.value, [...ids, dataCell.data.company_id.toString()]);
                } else {
                  postFilterationTagChange(e.target.value, [dataCell.data.company_id.toString()]);
                }
              }}
            />
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
      <Container>
        <Panel >
          <div className="d-flex mb-medium-length">
            <div className="w-100">
              <FilterationControls
                onBringAll={bringAllStocksToFilterationStep}
                onDelist={handleStockDelist}
                onSelectAll={() => handleSelection(true, ...stockDataCells)}
                onDeselectAll={resetSelection}
                onSelectUntil={() => handleSelectionUntil(true, ...stockDataCells)}
                onSelectAfter={() => handleSelectionAfter(true, ...stockDataCells)}
              />
            </div>
            {pAllowSubmit && (
              <div className="d-flex d-justify-end w-100">
                {<FiltrationSubmitForm
                  blackListedMap={{[pFilterationStepID]: true}}
                  onSubmit={handleStockSubmission}
                />}
              </div>
            )}
          </div>
          <div className="d-flex d-justify-end w-100">
            <span className="mr-medium-length">Apply verdict to selected</span>
            <StyledInput
              type="checkbox"
              checked={sweepingVerdict}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleSweepingVerdict(e.target.checked)}
            />
          </div>
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
        <div className="w-100">
          <Container>
            <CompanyListStatisticsPanel
              shownNumberOfCompanies={stockDataCells.length}
              numberOfCompanies={stocks.length}
            />
            <TableList<FilterationStepStock>
              onItemFocus={handleStockFocus}
              columns={stockDataColumns}
              cells={search(stockDataCells)}
              allowSelection={true}
              selectionSet={selectionSet}
              searchInputs={searchCriteria}
              onItemSelect={handleStockSelect}
              onColumnSelect={handleSortToggle}
              onSearch={handleCriteriaChange}
            />
          </Container>
        </div>
      </Container>
    </PageContainer>
  );
}
