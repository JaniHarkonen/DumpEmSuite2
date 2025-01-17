import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { Company } from "../../../../shared/schemaConfig";
import { AsString } from "../../../../shared/utils";
import { DatabaseManager, DatabaseValue } from "../database";
import { createError, destructureRunResult } from "../databaseAPI";
import { sqlPostNewCompany } from "./qPostNewCompany";


export default function qPostImportedCompanies(
  databaseManager: DatabaseManager, databaseName: string, company: (Company | AsString<Company>)[]
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string[] = company.map(() => sqlPostNewCompany());
      const values: DatabaseValue[][] = company.map((c: Company | AsString<Company>) => {
        return [
          c.company_name, 
          c.stock_ticker, 
          c.stock_price,
          c.volume_price,
          c.volume_quantity,
          c.exchange,
          c.updated,
          'EUR'
        ];
      });
      databaseManager.postMultiple(
        databaseName, preparedString,
        (result: RunResult | null, err: Error | null) => {
          if( !err ) {
            resolve(destructureRunResult(result));
          } else {
            reject(createError(err));
          }
        }, values
      );
    }
  );
}
