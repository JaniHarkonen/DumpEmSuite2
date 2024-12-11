import { useState } from "react";
import { BoundDatabaseAPI, FetchResult } from "src/shared/database.type";
import { Company, Currency, Tag } from "src/shared/schemaConfig";
import useDatabase from "./useDatabase";


export type CompanyWithCurrency = Company & Currency;

export type FilterationStepStock = CompanyWithCurrency & Tag;

export type Returns = {
  companies: CompanyWithCurrency[];
  fetchAllCompanies: () => void;
  fetchFilterationStepCompanies: (filterationStepID: string) => void;
  databaseAPI: BoundDatabaseAPI;
};


export default function useWorkspaceCompanies(): Returns {
  const [companies, setCompanies] = useState<(CompanyWithCurrency)[]>([]);
  const databaseAPI: BoundDatabaseAPI = useDatabase().databaseAPI!;

  const fetchAllCompanies = () => {
    databaseAPI.fetchAllCompanies()
    .then((result: FetchResult<CompanyWithCurrency>) => {
      if( result.wasSuccessful ) {
        setCompanies(result.rows);
      }
    });
  };

  const fetchFilterationStepCompanies = (filterationStepID: string) => {
    databaseAPI.fetchFilterationStepStocks({ filterationStepID })
    .then((result: FetchResult<FilterationStepStock>) => {
      if( result.wasSuccessful ) {
        setCompanies(result.rows);
      }
    })
  };

  
  return {
    companies,
    fetchAllCompanies,
    fetchFilterationStepCompanies,
    databaseAPI
  };
}
