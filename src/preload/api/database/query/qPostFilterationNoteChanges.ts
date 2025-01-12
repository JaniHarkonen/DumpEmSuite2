import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { Filteration, FKFilteration } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { AND, col, equals, query, SET, table, UPDATE, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qPostFilterationNoteChanges(
  databaseManager: DatabaseManager, 
  databaseName: string, 
  filterationStepID: string,
  companyID: string,
  value: string
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        UPDATE(table("filteration")) + 
        SET(equals(col<Filteration>("notes"), val())) + 
        WHERE(
          equals(col<FKFilteration>("fk_filteration_step_id"), val()) + 
          AND(
            equals(col<FKFilteration>("fk_filteration_company_id"), val())
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
        }, [value, filterationStepID, companyID]
      );
    }
  );
}
