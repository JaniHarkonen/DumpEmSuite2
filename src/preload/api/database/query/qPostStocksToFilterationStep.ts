import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { FKFilteration } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { AND, AS, col, equals, FROM, IN, insertInto, NOT, query, SELECT, subquery, table, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qPostStocksToFilterationStep(
  databaseManager: DatabaseManager, 
  databaseName: string,
  sourceStepID: string,
  targetStepID: string,
  stockIDs: string[],
  preserveTag: boolean,
  defaultTagID: string,
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const tagColumn: string = (
        preserveTag ? 
        col<FKFilteration>("fk_filteration_tag_id", "f") : 
        defaultTagID + AS(col<FKFilteration>("fk_filteration_tag_id"))
      );
      const preparedString: string = query(
        insertInto(
          table("filteration"),
          col<FKFilteration>("fk_filteration_company_id"),
          col<FKFilteration>("fk_filteration_step_id"),
          col<FKFilteration>("fk_filteration_tag_id")
        ) + SELECT(
          col<FKFilteration>("fk_filteration_company_id", "f"),
          val() + AS(col<FKFilteration>("fk_filteration_step_id")),
          tagColumn
        ) + FROM(
          table("filteration", "f")
        ) + WHERE(
          equals(col<FKFilteration>("fk_filteration_step_id", "f"), val()) + 
          AND(
            IN(
              col<FKFilteration>("fk_filteration_company_id"),
              ...stockIDs.map(() => val())
            )
          ) + AND(
            NOT() + IN(
              col<FKFilteration>("fk_filteration_company_id"),
              subquery(
                SELECT(col<FKFilteration>("fk_filteration_company_id")) + 
                FROM(table("filteration")) + 
                WHERE(
                  equals(col<FKFilteration>("fk_filteration_step_id"), val())
                )
              )
            )
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
        }, [targetStepID, sourceStepID, ...stockIDs, targetStepID]
      )
    }
  );
}
