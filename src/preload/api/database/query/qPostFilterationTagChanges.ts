import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { FKFilteration } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { AND, col, equals, IN, query, SET, table, UPDATE, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qPostFilterationTagChanges(
  databaseManager: DatabaseManager, 
  databaseName: string,
  filterationStepID: string, 
  companyID: string[], 
  tagID: string 
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        UPDATE(table("filteration")) + 
        SET(equals(col<FKFilteration>("fk_filteration_tag_id"), val())) + 
        WHERE(
          equals(col<FKFilteration>("fk_filteration_step_id"), val()) +
          AND(
            IN(col<FKFilteration>("fk_filteration_company_id"), ...companyID.map(() => val()))
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
        }, [tagID, filterationStepID, ...companyID]
      )
    }
  );
}
