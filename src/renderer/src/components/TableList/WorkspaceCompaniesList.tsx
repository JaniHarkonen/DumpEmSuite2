import { ReactNode, useEffect, useState } from "react";
import TableList from "./TableList";
import { Company, Currency } from "src/shared/schemaConfig";
import useDatabase from "@renderer/hook/useDatabase";


export default function WorkspaceCompaniesList(): ReactNode {
  const [stocks, setStocks] = useState<(Company & Currency)[]>([]);
  const {databaseAPI} = useDatabase();

  useEffect(() => {
    databaseAPI!.fetchAllCompanies()
    .then((result: (Company & Currency)[]) => {
      setStocks(result);
    });
  }, []);


  return (
    <TableList<Company & Currency>
      columns={[
        { accessor: "company_name", caption: "Name" },
        { accessor: "stock_ticker", caption: "Ticker" },
        { accessor: "volume_price", caption: "Volume ($)" },
        { accessor: "volume_quantity", caption: "Volume (quant.)" },
        { accessor: "stock_price", caption: "Share price ($)" },
        { accessor: "updated", caption: "Updated" }
      ]}
      data={stocks}
    />
  );
}
