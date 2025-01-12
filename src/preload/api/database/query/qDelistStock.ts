import { RunResult } from "sqlite3";
import { DeleteResult } from "../../../../shared/database.type";
import { FKFilteration } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { AND, col, DELETE, equals, FROM, IN, query, table, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qDelistStock(
  databaseManager: DatabaseManager, 
  databaseName: string, 
  filterationStepID: string,
  companyID: string[]
): Promise<DeleteResult> {
  return new Promise<DeleteResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        DELETE(
          FROM(table("filteration")) + 
          WHERE(
            equals(col<FKFilteration>("fk_filteration_step_id"), val()) + 
            AND(
              IN(
                col<FKFilteration>("fk_filteration_company_id"),
                ...companyID.map(() => val())
              )
            )
          )
        )
      );

      databaseManager.post(
        databaseName, preparedString,
        (runResult: RunResult | null, err: Error | null) => {
          if( !err ) {
            resolve(destructureRunResult(runResult));
          } else {
            reject(createError(err));
          }
        }, [filterationStepID, ...companyID]
      )
    }
  );
}
