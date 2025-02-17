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
  postFilterationTagChange: (tagID: string, companyID: string[]) => void;
  postStocksToFilterationStep: (
    targetStepID: string,
    stockIDs: string[],
    preserveTag: boolean
  ) => void;
  databaseAPI: BoundDatabaseAPI;
};

type Props = {
  filterationStepID: string;
  defaultTagID?: number;
};

export default function useFilterationStepStocks(props: Props): Returns {
  const pFilterationStepID: string = props.filterationStepID;
  const pDefaultTagID: number = props.defaultTagID ?? 1;

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
    databaseAPI.postAllStocksFromCompanyListings({
      filterationStepID: pFilterationStepID,
      defaultTagID: pDefaultTagID.toString()
    }).then((result: PostResult) => {
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

  const postFilterationTagChange = (tagID: string, companyID: string[]) => {
    databaseAPI.postFilterationTagChanges({
      filterationStepID: pFilterationStepID,
      companyID,
      tagID
    }).then((result: PostResult) => {
      if( result.wasSuccessful ) {
        fetchFilterationStepStocks();
      }
    })
  };

  const postStocksToFilterationStep = (
    targetStepID: string,
    stockIDs: string[],
    preserveTag: boolean
  ) => {
    databaseAPI.postStocksToFilterationStep({
      sourceStepID: pFilterationStepID,
      targetStepID,
      stockIDs,
      preserveTag,
      defaultTagID: pDefaultTagID.toString()
    });
  };


  return {
    stocks,
    fetchFilterationStepStocks,
    bringAllStocksToFilterationStep,
    delistStocks,
    postFilterationTagChange,
    postStocksToFilterationStep,
    databaseAPI
  };
}
