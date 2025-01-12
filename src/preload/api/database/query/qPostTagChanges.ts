import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { Tag } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { col, equals, query, SET, table, UPDATE, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qPostTagChanges(
  databaseManager: DatabaseManager, databaseName: string, updatedTag: Tag
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        UPDATE(table("tag")) + 
        SET(equals(col<Tag>("tag_hex"), val()), equals(col<Tag>("tag_label"), val())) + 
        WHERE(equals(col<Tag>("tag_id"), val()))
      );

      databaseManager.post(
        databaseName, preparedString,
        (runResult: RunResult | null, err: Error | null) => {
          if( !err ) {
            resolve(destructureRunResult(runResult));
          } else {
            reject(createError(err));
          }
        }, [updatedTag.tag_hex, updatedTag.tag_label, updatedTag.tag_id]
      )
    }
  );
}
