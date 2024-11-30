import { ReactNode } from "react";
import TableList, { EditChanges, TableListColumn, TableListDataCell } from "../TableList";
import { Company } from "src/shared/schemaConfig";
import CompanyControls from "@renderer/components/CompanyControls/CompanyControls";
import useSelection, { SelectionID, SelectionItem } from "@renderer/hook/useSelection";
import useWorkspaceComapanies, { CompanyWithCurrency } from "@renderer/hook/useWorkspaceCompanies";
import { AsString } from "src/shared/utils";


export const COMPANIES_LIST_COLUMNS: TableListColumn<CompanyWithCurrency>[] = [
  { accessor: "company_name", caption: "Name" },
  { accessor: "stock_ticker", caption: "Ticker" },
  { accessor: "volume_price", caption: "Volume ($)" },
  { accessor: "volume_quantity", caption: "Volume (quant.)" },
  { accessor: "stock_price", caption: "Share price ($)" },
  { accessor: "exchange", caption: "Exchange symbol" },
  { accessor: "chart_url", caption: "Chart URL" },
  { accessor: "updated", caption: "Updated" }
];

export default function WorkspaceCompaniesList(): ReactNode {
  const {
    selectionSet,
    handleSelection,
    getSelectedIDs,
    resetSelection
  } = useSelection<CompanyWithCurrency>({});

  const {
    companies,
    fetchIfSuccessful,
    databaseAPI
  } = useWorkspaceComapanies();

  const stockDataCells: TableListDataCell<CompanyWithCurrency>[] = 
    companies.map((stock: CompanyWithCurrency) => {
      return {
        id: stock.company_id,
        data: stock
      };
    });

  const handleAddCompany = (company: AsString<Company>) => {
    fetchIfSuccessful(databaseAPI.postNewCompany({ company }));
  };

  const handleCompanyRemove = () => {
    fetchIfSuccessful(databaseAPI.deleteCompanies({
      companies: getSelectedIDs().map((id: SelectionID) => selectionSet[id].item.data)
    }));
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
    fetchIfSuccessful(databaseAPI.postCompanyChanges({
      company: dataCell.data, 
      attributes: changes.columns as (keyof Company)[], 
      values: changes.values
    }));
  };


  return (
    <div className="w-100">
      <CompanyControls
        onAdd={handleAddCompany}
        onRemove={handleCompanyRemove}
        onSelectAll={() => handleSelection(true, ...stockDataCells)}
        onDeselectAll={resetSelection}
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
