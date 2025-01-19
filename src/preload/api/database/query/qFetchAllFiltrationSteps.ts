import { FetchResult } from "../../../../shared/database.type";
import { FilterationStep } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { createError } from "../databaseAPI";
import { FROM, query, SELECT, table } from "../sql";

export default function qFetchAllFiltrationSteps(
  databaseManager: DatabaseManager, databaseName: string
): Promise<FetchResult<FilterationStep>> {
  return new Promise<FetchResult<FilterationStep>>(
    (resolve, reject) => {
      const preparedString: string = query(
        SELECT("*") + 
        FROM(table("filteration_step"))
      );
      databaseManager.fetch(
        databaseName, preparedString,
        (err: Error | null, rows: FilterationStep[]) => {
          if( !err ) {
            resolve({
              wasSuccessful: true,
              rows
            });
          } else {
            reject(createError(err));
          }
        }, []
      )
    }
  )
}
