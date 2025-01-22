import { ReactNode, useContext, useEffect } from "react";
import TableList, { EditChanges, TableListColumn, TableListDataCell } from "../TableList/TableList";
import { Company } from "src/shared/schemaConfig";
import CompanyControls from "@renderer/components/CompanyControls/CompanyControls";
import useSelection, { SelectionID, SelectionItem } from "@renderer/hook/useSelection";
import useWorkspaceCompanies, { CompanyWithCurrency } from "@renderer/hook/useWorkspaceCompanies";
import { AsString } from "src/shared/utils";
import ifQuerySuccessful from "@renderer/utils/ifQuerySuccessful";
import { ScrapedData } from "src/shared/scraper.type";
import useFileSystemDialog from "@renderer/hook/useFileSystemDialog";
import useWorkspaceDialogKeys from "@renderer/hook/useWorkspaceDialogKeys";
import { OpenDialogResult, ReadResult } from "src/shared/files.type";
import Container from "../Container/Container";
import { milleFormatter, priceFormatter } from "@renderer/utils/formatter";
import useSortedData, { SortSettings } from "@renderer/hook/useSortedData";
import { TabsContext } from "@renderer/context/TabsContext";
import { Tab } from "@renderer/model/tabs";


export const COMPANIES_LIST_COLUMNS: TableListColumn<CompanyWithCurrency>[] = [
  { 
    accessor: "company_name", 
    caption: "Name" 
  },
  { 
    accessor: "stock_ticker", 
    caption: "Ticker" 
  },
  { 
    accessor: "volume_price", 
    caption: "Currency volume",
    formatter: (
      data: CompanyWithCurrency, dataCell: TableListDataCell<CompanyWithCurrency>
    ) => {
      return priceFormatter(dataCell.data.currency_symbol, "" + data.volume_price);
    }
  },
  { 
    accessor: "volume_quantity", 
    caption: "Volume",
    formatter: (data: CompanyWithCurrency) => {
      return milleFormatter("" + data.volume_quantity);
    }
  },
  { 
    accessor: "stock_price", 
    caption: "Share price",
    formatter: (
      data: CompanyWithCurrency, dataCell: TableListDataCell<CompanyWithCurrency>
    ) => {
      return priceFormatter(dataCell.data.currency_symbol, "" + data.stock_price);
    }
  },
  { 
    accessor: "exchange", 
    caption: "Exchange symbol" 
  },
  { 
    accessor: "updated", 
    caption: "Updated"
  }
];


const {filesAPI} = window.api;

export default function WorkspaceCompaniesList(): ReactNode {
  const {
    selectionSet,
    handleSelection,
    getSelectedIDs,
    resetSelection
  } = useSelection<CompanyWithCurrency>({});

  const {
    companies,
    fetchAllCompanies,
    databaseAPI
  } = useWorkspaceCompanies();

  const {formatDialogKey} = useWorkspaceDialogKeys();

  const dialogKeyImportCompanies: string = formatDialogKey("import-companies");

  const {showOpenFileDialog} = useFileSystemDialog({
    onOpenDialogResult: (result: OpenDialogResult) => {
      if( !result.cancelled && result.key === dialogKeyImportCompanies ) {
        filesAPI.readJSON<ScrapedData>(result.path[0]).then((result: ReadResult<ScrapedData>) => {

          if( result.wasSuccessful ) {
            databaseAPI.postImportedCompanies({
              company: result.result.symbols as Company[]
            }).then(() => fetchAllCompanies());
          }
        });
      }
    }
  });

  useEffect(() => fetchAllCompanies(), []);

  const {tabs, activeTabIndex, setExtraInfo} = useContext(TabsContext);

  const activeTab: Tab = tabs[activeTabIndex];

  const {
    sortedData, 
    sortField, 
    sortOrder, 
    sortBy
  } = useSortedData({
    initialOrder: companies,
    fieldTypeMap: {
      company_name: "string",
      stock_ticker: "string",
      stock_price: "numeric",
      volume_price: "numeric",
      volume_quantity: "numeric",
      exchange: "string",
      updated: "string",
    },
    sortField: activeTab?.extra?.sortField,
    sortOrder: activeTab?.extra?.sortOrder
  });

  const handleSortToggle = (column: TableListColumn<CompanyWithCurrency>) => {
    const settings: SortSettings = sortBy(column.accessor);
    setExtraInfo && setExtraInfo({
      sortField: settings.sortField,
      sortOrder: settings.sortOrder
    });
  };

    // Fix the stock data to be compatible with the table component
  const stockDataCells: TableListDataCell<CompanyWithCurrency>[] = 
    sortedData.map((stock: CompanyWithCurrency) => {
      return {
        id: stock.company_id,
        data: stock
      };
    });

    // Determine which column is being sorted, and assign its sort order
  const stockDataColumns: TableListColumn<CompanyWithCurrency>[] = 
    COMPANIES_LIST_COLUMNS.map((column: TableListColumn<CompanyWithCurrency>) => {
      return {
        ...column,
        ...(sortField === column.accessor ? { sortOrder } : {})
      };
    });

  const handleAddCompany = (company: AsString<Company>) => {
    ifQuerySuccessful(databaseAPI.postNewCompany({ company }), fetchAllCompanies);
  };

  const handleCompanyRemove = () => {
    ifQuerySuccessful(databaseAPI.deleteCompanies({
      companies: getSelectedIDs().map((id: SelectionID) => selectionSet[id].item.data)
    }), fetchAllCompanies);
  };

  const handleCompanySelection = (
    item: SelectionItem<CompanyWithCurrency>, isChecked: boolean
  ) => {
    handleSelection(isChecked, ...[item]);
  };

  const handleCompanyChange = (
    dataCell: TableListDataCell<CompanyWithCurrency>, 
    changes: EditChanges<CompanyWithCurrency>
  ) => {
    ifQuerySuccessful(databaseAPI.postCompanyChanges({
      company: dataCell.data, 
      attributes: changes.columns as (keyof Company)[], 
      values: changes.values
    }), fetchAllCompanies);
  };

  const handleImport = () => {
    showOpenFileDialog({
      key: dialogKeyImportCompanies,
      options: {
        title: "Select a JSON of scraped stocks"
      }
    });
  };

  return (
    <div className="w-100">
      <Container>
        <CompanyControls
          onAdd={handleAddCompany}
          onRemove={handleCompanyRemove}
          onSelectAll={() => handleSelection(true, ...stockDataCells)}
          onDeselectAll={resetSelection}
          onImport={handleImport}
        />
        <TableList<CompanyWithCurrency>
          columns={stockDataColumns}
          cells={stockDataCells}
          allowSelection
          allowEdit
          selectionSet={selectionSet}
          onItemSelect={handleCompanySelection}
          onItemFinalize={handleCompanyChange}
          onColumnSelect={handleSortToggle}
        />
      </Container>
    </div>
  );
}
