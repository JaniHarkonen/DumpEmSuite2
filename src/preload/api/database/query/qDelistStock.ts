import { RunResult } from "sqlite3";
import { DeleteResult } from "../../../../shared/database.type";
import { FKFilteration } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { AND, col, DELETE, equals, FROM, IN, query, table, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";
import path, { ParsedPath } from "path";
import { RELATIVE_APP_PATHS } from "../../../../shared/appConfig";
import { rm } from "fs/promises";


export default function qDelistStock(
  databaseManager: DatabaseManager, 
  databaseName: string, 
  filterationStepID: string,
  companyID: string[]
): Promise<DeleteResult> {
  return new Promise<DeleteResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        DELETE(
          FROM(table("filteration")) + 
          WHERE(
            equals(col<FKFilteration>("fk_filteration_step_id"), val()) + 
            AND(
              IN(
                col<FKFilteration>("fk_filteration_company_id"),
                ...companyID.map(() => val())
              )
            )
          )
        )
      );

        // In case of the fundamental filtration view, there are materials folders that also need to
        // be removed
      if( filterationStepID === "view-fundamental" ) {
        const databasePath: string | null = databaseManager.getPath(databaseName);
  
          // Delete the associated materials directory
        if( databasePath ) {
          const parse: ParsedPath = path.parse(databasePath);
          companyID.forEach((id: string) => {
            rm(
              RELATIVE_APP_PATHS.make.fundamental(parse.dir, id),
              { recursive: true }
            );
          });
        }
      }

      databaseManager.post(
        databaseName, preparedString,
        (runResult: RunResult | null, err: Error | null) => {
          if( !err ) {
            resolve(destructureRunResult(runResult));
          } else {
            reject(createError(err));
          }
        }, [filterationStepID, ...companyID]
      );
    }
  );
}
