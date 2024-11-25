import { ReactNode, useEffect, useState } from "react";
import TableList from "../TableList";
import { Company, Currency } from "src/shared/schemaConfig";
import useDatabase from "@renderer/hook/useDatabase";
import { FetchResult } from "src/shared/database.type";


export default function CompanyProfilesList(): ReactNode {
  const [stocks, setStocks] = useState<(Company & Currency)[]>([]);
  const {databaseAPI} = useDatabase();

  useEffect(() => {
    databaseAPI!.fetchAllCompanies()
    .then((result: FetchResult<Company & Currency>) => {
      if( result.wasSuccessful ) {
        setStocks(result.rows);
      }
    });
  }, []);


  return (
    <TableList<Company & Currency>
      columns={[
        { accessor: "company_name", caption: "Name" },
        { accessor: "stock_ticker", caption: "Ticker" },
        { accessor: "updated", caption: "Updated" }
      ]}
      cells={stocks.map((company: Company & Currency) => {
        return {
          id: company.company_id,
          data: company
        };
      })}
    />
  );
}
