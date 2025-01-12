import { RunResult } from "sqlite3";
import { DeleteResult } from "../../../../shared/database.type";
import { FilterationStep } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { col, DELETE, equals, FROM, query, table, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qDeleteFilterationStep(
  databaseManager: DatabaseManager, databaseName: string, step_id: string
): Promise<DeleteResult> {
  return new Promise<DeleteResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        DELETE(
          FROM(table("filteration_step")) + 
          WHERE(equals(col<FilterationStep>("step_id"), val()))
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
        }, [step_id]
      );
    }
  );
}
