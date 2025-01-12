import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { FilterationStep } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { col, insertInto, query, table, val, value, values } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qPostNewFilterationStep(
  databaseManager: DatabaseManager, databaseName: string, filterationStep: FilterationStep
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        insertInto(
          table("filteration_step"),
          col<FilterationStep>("step_id"),
          col<FilterationStep>("caption")
        ) + values(
          value(val(), val())
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
        }, [filterationStep.step_id, filterationStep.caption]
      );
    }
  );
}
