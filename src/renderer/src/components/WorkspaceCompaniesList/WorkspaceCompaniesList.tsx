import { ReactNode, useEffect } from "react";
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
import { PostResult } from "src/shared/database.type";


export const COMPANIES_LIST_COLUMNS: TableListColumn<CompanyWithCurrency>[] = [
  { accessor: "company_name", caption: "Name" },
  { accessor: "stock_ticker", caption: "Ticker" },
  { accessor: "volume_price", caption: "Volume ($)" },
  { accessor: "volume_quantity", caption: "Volume (quant.)" },
  { accessor: "stock_price", caption: "Share price ($)" },
  { accessor: "exchange", caption: "Exchange symbol" },
  { accessor: "updated", caption: "Updated" }
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
            }).then((result: PostResult) => {
              console.log(result);
              fetchAllCompanies();
            });
          }
        });
      }
    }
  });

  useEffect(() => {
    fetchAllCompanies();
  }, []);

  const stockDataCells: TableListDataCell<CompanyWithCurrency>[] = 
    companies.map((stock: CompanyWithCurrency) => {
      return {
        id: stock.company_id,
        data: stock
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
      <CompanyControls
        onAdd={handleAddCompany}
        onRemove={handleCompanyRemove}
        onSelectAll={() => handleSelection(true, ...stockDataCells)}
        onDeselectAll={resetSelection}
        onImport={handleImport}
      />
      <TableList<CompanyWithCurrency>
        columns={COMPANIES_LIST_COLUMNS}
        cells={stockDataCells}
        allowSelection
        allowEdit
        selectionSet={selectionSet}
        onItemSelect={handleCompanySelection}
        onItemFinalize={handleCompanyChange}
      />
    </div>
  );
}
