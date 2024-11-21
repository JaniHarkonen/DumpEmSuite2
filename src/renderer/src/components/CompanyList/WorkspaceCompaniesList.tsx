import { ReactNode, useEffect, useState } from "react";
import CompanyList from "./CompanyList";
import { CompanyStock } from "@renderer/model/companies";
import { Company, Currency } from "src/shared/schemaConfig";
import useDatabase from "@renderer/hook/useDatabase";


export default function WorkspaceCompaniesList(): ReactNode {
  const [stocks, setStocks] = useState<CompanyStock[]>([]);
  const {databaseAPI} = useDatabase();

  useEffect(() => {
    databaseAPI!.fetchAllCompanies()
    .then((result: (Company & Currency)[]) => {
      setStocks(result.map((company: Company & Currency) => {
        return {
          companyName: company.company_name,
          stockTicker: company.stock_ticker,
          volume: {
            priceTotal: company.volume_price,
            quantity: company.volume_quantity
          },
          stockPrice: {
            currency: company.currency_id,
            price: company.stock_price
          },
          scraper: {
            dateScraped: company.updated
          }
        };
      }));
    });
  }, []);

  return <CompanyList stocks={stocks}/>;
}
