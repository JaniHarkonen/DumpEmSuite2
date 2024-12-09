import { useState } from "react";
import { BoundDatabaseAPI, DeleteResult, FetchResult, PostResult } from "src/shared/database.type";
import { Company, Currency, Tag } from "src/shared/schemaConfig";
import useDatabase from "./useDatabase";


export type FilterationStepStock = Company & Currency & Tag;

export type Returns = {
  stocks: FilterationStepStock[];
  fetchFilterationStepStocks: () => void;
  bringAllStocksToFilterationStep: () => void;
  delistStocks: (...companyID: string[]) => void;
  databaseAPI: BoundDatabaseAPI;
};

type Props = {
  filterationStepID: string;
};

export default function useFilterationStepStocks(props: Props): Returns {
  const pFilterationStepID: string = props.filterationStepID;
  const [stocks, setStocks] = useState<FilterationStepStock[]>([]);
  const databaseAPI: BoundDatabaseAPI = useDatabase().databaseAPI!;

  const fetchFilterationStepStocks = () => {
    databaseAPI.fetchFilterationStepStocks({ filterationStepID: pFilterationStepID })
    .then((result: FetchResult<FilterationStepStock>) => {
      if( result.wasSuccessful ) {
        setStocks(result.rows);
      }
    });
  };

  const bringAllStocksToFilterationStep = () => {
    databaseAPI.postAllStocksFromCompanyListings({ filterationStepID: pFilterationStepID })
    .then((result: PostResult) => {
      if( result.wasSuccessful ) {
        fetchFilterationStepStocks();
      }
    });
  };

  const delistStocks = (...companyID: string[]) => {
    databaseAPI.delistStock({
      filterationStepID: pFilterationStepID,
      companyID
    }).then((result: DeleteResult) => {
      if( result.wasSuccessful ) {
        fetchFilterationStepStocks();
      }
    });
  };


  return {
    stocks,
    fetchFilterationStepStocks,
    bringAllStocksToFilterationStep,
    delistStocks,
    databaseAPI
  };
}
