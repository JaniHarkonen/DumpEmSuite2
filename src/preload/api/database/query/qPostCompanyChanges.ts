import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { Company } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { col, equals, query, SET, table, UPDATE, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qPostCompanyChanges(
  databaseManager: DatabaseManager, 
  databaseName: string,
  company: Company,
  attributes: (keyof Company)[],
  values: string[]
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const setterString: string[] = attributes.map((attrib: keyof Company) => {
        return equals(col<Company>(attrib), val());
      });

      const preparedString: string = query(
        UPDATE(table("company")) + 
        SET(...setterString) + 
        WHERE(equals(col<Company>("company_id"), val()))
      );

      databaseManager.post(
        databaseName, preparedString,
        (runResult: RunResult | null, err: Error | null) => {
          if( !err ) {
            resolve(destructureRunResult(runResult));
          } else {
            reject(createError(err));
          }
        }, [...values, company.company_id]
      )
    }
  );
}
