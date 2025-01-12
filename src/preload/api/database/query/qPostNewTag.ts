import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { Tag } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { col, insertInto, query, table, val, value, values } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";
import { AsString } from "../../../../shared/utils";


export default function qPostNewTag(
  databaseManager: DatabaseManager, databaseName: string, tag: Tag | AsString<Tag>
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        insertInto(
          table("tag"),
          col<Tag>("tag_hex"),
          col<Tag>("tag_label")
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
        }, [tag.tag_hex, tag.tag_label]
      );
    }
  );
}
