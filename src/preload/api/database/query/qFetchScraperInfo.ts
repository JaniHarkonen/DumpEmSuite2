import { FetchResult } from "../../../../shared/database.type";
import { Scraper } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { createError } from "../databaseAPI";
import { col, FROM, query, SELECT, table } from "../sql";


export default function qFetchScraperInfo(
  databaseManager: DatabaseManager, databaseName: string
): Promise<FetchResult<Scraper>> {
  return new Promise<FetchResult<Scraper>>(
    (resolve, reject) => {
      const preparedString: string = query(
        SELECT(col("*")) + 
        FROM(table("scraper"))
      );
      
      databaseManager.fetch<Scraper>(
        databaseName, preparedString,
        (err: Error | null, rows: Scraper[]) => {
          if( !err ) {
            resolve({
              wasSuccessful: true,
              rows
            });
          } else {
            reject(createError(err))
          }
        }, []
      );
    }
  );
}
