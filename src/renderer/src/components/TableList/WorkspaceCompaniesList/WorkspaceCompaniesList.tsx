import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import TableList, { ListColumn } from "../TableList";
import { Company, Currency } from "src/shared/schemaConfig";
import useDatabase from "@renderer/hook/useDatabase";
import CompanyControls from "@renderer/components/CompanyControls/CompanyControls";
import { BoundDatabaseAPI, FetchResult, PostResult } from "src/shared/database.type";


const COLUMNS: ListColumn<Company & Currency>[] = [
  { accessor: "company_name", caption: "Name" },
  { accessor: "stock_ticker", caption: "Ticker" },
  { accessor: "volume_price", caption: "Volume ($)" },
  { accessor: "volume_quantity", caption: "Volume (quant.)" },
  { accessor: "stock_price", caption: "Share price ($)" },
  { accessor: "exchange", caption: "Exchange symbol" },
  { accessor: "chart_url", caption: "Chart URL" },
  { accessor: "updated", caption: "Updated" }
];

type Selection = {
  [id: number | string]: {
    isSelected: boolean;
    item: Company & Currency
  };
};

export default function WorkspaceCompaniesList(): ReactNode {
  const [stocks, setStocks] = useState<(Company & Currency)[]>([]);
  const [stockSelection, setStockSelection] = useState<Selection>({});
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

  const databaseAPI: BoundDatabaseAPI = useDatabase().databaseAPI!;

  const fetchAllCompanies = () => {
    databaseAPI.fetchAllCompanies()
    .then((result: FetchResult<Company & Currency>) => {
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
      console.log(result)
      if( result.wasSuccessful ) {
        fetchAllCompanies();
      }
    });
  };

  const handleCompanyRemove = () => {
    const companies: Company[] = [];
    for( let key of Object.keys(stockSelection) ) {
      if( stockSelection[key].isSelected ) {
        companies.push(stockSelection[key].item);
      }
    }
    databaseAPI.deleteCompanies({ companies })
    .then((result: PostResult) => {
      setStockSelection({});
      if( result.wasSuccessful ) {
        fetchAllCompanies();
      }
    });
  };

  const handleCompanySelection = (item: Company & Currency, isChecked: boolean) => {
    setStockSelection((prev: Selection) => {
      return {
        ...prev,
        [item.company_id]: {
          isSelected: isChecked,
          item
        }
      };
    });
  };


  return (
    <div className="w-100">
      <CompanyControls
        onAdd={() => setDisplayAddControls(true)}
        onRemove={handleCompanyRemove}
      />
      {displayAddControls && (
        <div className="d-flex">
          <button onClick={handleAddCompany}>Add</button>
          {COLUMNS.map((column: ListColumn<Company & Currency>) => {
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
      <TableList<Company & Currency>
        columns={COLUMNS}
        data={stocks}
        allowSelection
        onColumnSelect={(column) => console.log(column)}
        onItemFocus={(item) => console.log(item)}
        onItemSelect={handleCompanySelection}
      />
    </div>
  );
}
