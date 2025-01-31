import { createError } from "../databaseAPI";
import { FetchResult, WorkspaceStructure } from "../../../../shared/database.type";
import { FROM, SELECT, table } from "../sql";
import { DatabaseManager } from "../database";


export default function qFetchWorkspaceStructure(
  databaseManager: DatabaseManager, databaseName: string, databasePath: string
): Promise<FetchResult<WorkspaceStructure>> {
  return new Promise<FetchResult<WorkspaceStructure>>(
    (resolve, reject) => {
      databaseManager.open(databaseName, databasePath, (err: Error | null) => {
        if( !err ) {
          databaseManager.fetchMultiple(
            databaseName, 
            [
              SELECT("*") + FROM(table("filteration_step")),
              SELECT("*") + FROM(table("macro_sector")),
              SELECT("*") + FROM(table("metadata"))
            ],
            [[],[],[]],
            ["filteration_step", "macro_sector", "metadata"],
            (error: Error | null, results: WorkspaceStructure) => {
              if( !error ) {
                databaseManager.close(databaseName, () => {
                  resolve({
                    wasSuccessful: true,
                    rows: [results]
                  });
                });
              } else {
                reject(error);
              }
            }
          );
        } else {
          reject(createError(err));
        }
      })
    }
  )
}
