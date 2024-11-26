import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import TableList, { EditChanges, TableListColumn, TableListDataCell } from "../TableList";
import { Company, Currency } from "src/shared/schemaConfig";
import useDatabase from "@renderer/hook/useDatabase";
import CompanyControls from "@renderer/components/CompanyControls/CompanyControls";
import { BoundDatabaseAPI, FetchResult, PostResult } from "src/shared/database.type";
import useSelection, { SelectionID, SelectionItem } from "@renderer/hook/useSelection";


type CompanyWithCurrency = Company & Currency;

const COLUMNS: TableListColumn<CompanyWithCurrency>[] = [
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
  const [stocks, setStocks] = useState<(CompanyWithCurrency)[]>([]);
  const [displayAddControls, setDisplayAddControls] = useState<boolean>(false);
  const [addCandidateCompany, setAddCandidateCompany] = useState<Company>({
    company_id: -1,
    company_name: "",
    stock_ticker: "",
    stock_price: 0,
    volume_price: 0,
    volume_quantity: 0,
    exchange: "",
    chart_url: "",
    updated: ""
  });

  const {
    selectionSet,
    handleSelection,
    getSelectedIDs,
    resetSelection
  } = useSelection<CompanyWithCurrency>({});

  const databaseAPI: BoundDatabaseAPI = useDatabase().databaseAPI!;

  const stockDataCells: TableListDataCell<CompanyWithCurrency>[] = 
    stocks.map((stock: CompanyWithCurrency) => {
      return {
        id: stock.company_id,
        data: stock
      };
    });

  const fetchAllCompanies = () => {
    databaseAPI.fetchAllCompanies()
    .then((result: FetchResult<CompanyWithCurrency>) => {
      if( result.wasSuccessful ) {
        setStocks(result.rows);
      }
    });
  };

  useEffect(() => {
    fetchAllCompanies();
  }, []);

  const handleAddCompany = () => {
    databaseAPI.postNewCompany({ company: addCandidateCompany })
    .then((result: PostResult) => {
      if( result.wasSuccessful ) {
        fetchAllCompanies();
      }
    });
  };

  const handleCompanyRemove = () => {
    databaseAPI.deleteCompanies({
      companies: getSelectedIDs().map((id: SelectionID) => selectionSet[id].item.data)
    }).then((result: PostResult) => {
      resetSelection();

      if( result.wasSuccessful ) {
        fetchAllCompanies();
      }
    });
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
    databaseAPI.postCompanyChanges({
      company: dataCell.data, 
      attributes: changes.columns as (keyof Company)[], 
      values: changes.values
    }).then((result: PostResult) => {
      if( result.wasSuccessful ) {
        fetchAllCompanies();
      }
    });
  };


  return (
    <div className="w-100">
      <CompanyControls
        onAdd={() => setDisplayAddControls(true)}
        onRemove={handleCompanyRemove}
        onSelectAll={() => handleSelection(true, ...stockDataCells)}
        onDeselectAll={resetSelection}
      />
      {displayAddControls && (
        <div className="d-flex">
          <button onClick={handleAddCompany}>Add</button>
          {COLUMNS.map((column: TableListColumn<CompanyWithCurrency>) => {
            const id: string = "companies-list-add-controls-input-" + column.accessor;
            return (
              <div key={id}>
                <label htmlFor={id}>{column.caption}</label>
                <input 
                  id={id} 
                  type="text"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setAddCandidateCompany({
                      ...addCandidateCompany,
                      [column.accessor]: e.target.value
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
      <TableList<CompanyWithCurrency>
        columns={COLUMNS}
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
