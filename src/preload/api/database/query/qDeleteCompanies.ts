import { RunResult } from "sqlite3";
import { DeleteResult } from "../../../../shared/database.type";
import { Company } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { col, DELETE, FROM, IN, query, table, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";
import { RELATIVE_APP_PATHS } from "../../../../shared/appConfig";
import path, { ParsedPath } from "path";
import { rm } from "fs/promises";


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

        // Delete the associated materials directory
      companies.forEach((company: Company) => {
        const databasePath: string | null = databaseManager.getPath(databaseName);

        if( databasePath ) {
          const parse: ParsedPath = path.parse(databasePath);
          rm(
            RELATIVE_APP_PATHS.make.fundamental(parse.dir, company.company_id.toString()), 
            { recursive: true }
          );
        }
      });

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
