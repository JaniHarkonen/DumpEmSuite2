import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { FilterationStep } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { col, equals, query, SET, table, UPDATE, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qPostFilterationStepCaption(
  databaseManager: DatabaseManager, databaseName: string, filterationStep: FilterationStep
): Promise<PostResult>{
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        UPDATE(table("filteration_step")) + 
        SET(equals(col<FilterationStep>("caption"), val())) + 
        WHERE(equals(col<FilterationStep>("step_id"), val()))
      );

      databaseManager.post(
        databaseName, preparedString,
        (runResult: RunResult | null, err: Error | null) => {
          if( !err ) {
            resolve(destructureRunResult(runResult));
          } else {
            reject(createError(err));
          }
        }, [filterationStep.caption, filterationStep.step_id]
      );
    }
  );
}
