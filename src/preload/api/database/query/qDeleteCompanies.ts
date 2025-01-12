import { RunResult } from "sqlite3";
import { DeleteResult } from "../../../../shared/database.type";
import { Company } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { col, DELETE, FROM, IN, query, table, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qDeleteCompanies(
  databaseManager: DatabaseManager, databaseName: string, companies: Company[]
): Promise<DeleteResult> {
  return new Promise<DeleteResult>(
    (resolve, reject) => {
      const companyIDs: string[] = companies.map(
        (company: Company) => company.company_id.toString()
      );
      const preparedString: string = query(
        DELETE(
          FROM(table("company")) + 
          WHERE(IN(col<Company>("company_id"), ...companies.map(() => val())))
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
        }, companyIDs
      )
    }
  );
}
