import { FetchResult } from "../../../../shared/database.type";
import { Tag } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { createError } from "../databaseAPI";
import { col, FROM, query, SELECT, table } from "../sql";


export default function qFetchAllTags(
  databaseManager: DatabaseManager, databaseName: string
): Promise<FetchResult<Tag>> {
  return new Promise<FetchResult<Tag>>(
    (resolve, reject) => {
      const preparedString: string = query(
        SELECT(
          col<Tag>("tag_id"), 
          col<Tag>("tag_hex"), 
          col<Tag>("tag_label")
        ) + FROM(
          table("tag")
        )
      );

      databaseManager.fetch<Tag>(
        databaseName, preparedString, 
        (err: Error | null, rows: (Tag)[]) => {
          if( !err ) {
            resolve({
              wasSuccessful: true,
              rows
            })
          } else {
            reject(createError(err));
          }
        }, []
      );
    }
  );
}
