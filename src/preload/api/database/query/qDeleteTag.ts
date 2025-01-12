import { RunResult } from "sqlite3";
import { DeleteResult } from "../../../../shared/database.type";
import { Tag } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { col, DELETE, equals, FROM, query, table, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qDeleteTag(
  databaseManager: DatabaseManager, databaseName: string, tag: Tag
): Promise<DeleteResult> {
  return new Promise<DeleteResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        DELETE(
          FROM(table("tag")) + 
          WHERE(equals(col<Tag>("tag_id"), val()))
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
        }, [tag.tag_id]
      )
    }
  );
}
