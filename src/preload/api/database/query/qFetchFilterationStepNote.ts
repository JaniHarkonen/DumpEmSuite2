import { FetchResult } from "../../../../shared/database.type";
import { Filteration, FKFilteration } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { createError } from "../databaseAPI";
import { AND, col, equals, FROM, query, SELECT, table, val, WHERE } from "../sql";


export default function qFetchFilterationStepNote(
  databaseManager: DatabaseManager, 
  databaseName: string, 
  filterationStepID: string, 
  companyID: string
): Promise<FetchResult<Filteration>> {
  return new Promise<FetchResult<Filteration>>(
    (resolve, reject) => {
      const preparedString: string = query(
        SELECT(
          col<Filteration>("notes", "f")
        ) + FROM(
          table("filteration", "f")
        ) + WHERE(
          equals(
            col<FKFilteration>("fk_filteration_step_id", "f"), val()
          ) + AND(
            equals(
              col<FKFilteration>("fk_filteration_company_id", "f"), val()
            )
          )
        )
      );

      databaseManager.fetch<Filteration>(
        databaseName, preparedString,
        (err: Error | null, rows: (Filteration)[]) => {
          if( !err ) {
            resolve({
              wasSuccessful: true,
              rows
            });
          } else {
            reject(createError(err));
          }
        }, [filterationStepID, companyID]
      );
    }
  );
}
