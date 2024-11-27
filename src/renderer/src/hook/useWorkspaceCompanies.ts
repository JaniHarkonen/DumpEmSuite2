import { useEffect, useState } from "react";
import { BoundDatabaseAPI, FetchResult, QueryResult } from "src/shared/database.type";
import { Company, Currency } from "src/shared/schemaConfig";
import useDatabase from "./useDatabase";


export type CompanyWithCurrency = Company & Currency;
export type Returns = {
  companies: CompanyWithCurrency[];
  fetchAllCompanies: () => void;
  fetchIfSuccessful: (queryPromise: Promise<QueryResult>) => void;
  databaseAPI: BoundDatabaseAPI;
};

export default function useWorkspaceComapanies(): Returns {
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

  useEffect(() => {
    fetchAllCompanies();
  }, []);

  const fetchIfSuccessful = (queryPromise: Promise<QueryResult>) => {
    queryPromise.then((result: QueryResult) => {
      if( result.wasSuccessful ) {
        fetchAllCompanies();
      }
    })
  };

  return {
    companies,
    fetchAllCompanies,
    fetchIfSuccessful,
    databaseAPI
  };
}
