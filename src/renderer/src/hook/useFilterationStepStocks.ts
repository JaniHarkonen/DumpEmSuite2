import { useState } from "react";
import { BoundDatabaseAPI, FetchResult } from "src/shared/database.type";
import { Company, Currency, Tag } from "src/shared/schemaConfig";
import useDatabase from "./useDatabase";

export type FilterationStepStock = Company & Currency & Tag;

export type Returns = {
  stocks: FilterationStepStock[];
  fetchFilterationStepCompanies: (filterationStepID: string) => void;
  databaseAPI: BoundDatabaseAPI;
};


export default function useFilterationStepStocks(): Returns {
  const [stocks, setStocks] = useState<FilterationStepStock[]>([]);
  const databaseAPI: BoundDatabaseAPI = useDatabase().databaseAPI!;

  const fetchFilterationStepCompanies = (filterationStepID: string) => {
    databaseAPI.fetchFilterationStepStocks({ filterationStepID })
    .then((result: FetchResult<FilterationStepStock>) => {
      if( result.wasSuccessful ) {
        console.log(result)
        setStocks(result.rows);
      }
    })
  };


  return {
    stocks,
    fetchFilterationStepCompanies,
    databaseAPI
  };
}
