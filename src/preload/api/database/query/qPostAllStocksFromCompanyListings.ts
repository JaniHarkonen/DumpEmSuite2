import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { Company, FilterationStep, FKFilteration, Tag } from "../../../../shared/schemaConfig";
import { AND, col, equals, FROM, IN, insertInto, NOT, query, SELECT, table, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";
import { DatabaseManager } from "../database";


export default function qPostAllStocksFromCompanyListings(
  databaseManager: DatabaseManager, 
  databaseName: string, 
  filterationStepID: string, 
  defaultTagID: string
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        insertInto(
          table("filteration"),
          col<FKFilteration>("fk_filteration_company_id"),
          col<FKFilteration>("fk_filteration_step_id"),
          col<FKFilteration>("fk_filteration_tag_id")
        ) + SELECT(
          col<Company>("company_id", "c"),
          col<FilterationStep>("step_id", "fs"),
          col<Tag>("tag_id", "t")
        ) + FROM(
          table("company", "c"),
          table("filteration_step", "fs"),
          table("tag", "t"),
        ) + WHERE(
          equals(col<Tag>("tag_id", "t"), defaultTagID) + 
          AND(
            equals(col<FilterationStep>("step_id", "fs"), val())
          ) + AND(
            NOT() + IN(
              col<Company>("company_id", "c"),
              SELECT(col<FKFilteration>("fk_filteration_company_id", "f")) + 
              FROM(table("filteration", "f")) + 
              WHERE(
                equals(col<FKFilteration>("fk_filteration_step_id", "f"), val())
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
        }, [filterationStepID, filterationStepID]
      );
    }
  );
}
