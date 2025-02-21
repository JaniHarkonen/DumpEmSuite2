import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { Company, FKCompany } from "../../../../shared/schemaConfig";
import { AsString } from "../../../../shared/utils";
import { DatabaseManager, DatabaseValue } from "../database";
import { createError, destructureRunResult } from "../databaseAPI";
import { col, table, upsert } from "../sql";


export default function qPostImportedCompanies(
  databaseManager: DatabaseManager, databaseName: string, company: (Company | AsString<Company>)[]
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string[] = company.map(() => upsert(
        table("company"),
        col<Company>("company_name"), 
        col<Company>("stock_ticker"), 
        col<Company>("stock_price"),
        col<Company>("volume_price"),
        col<Company>("volume_quantity"),
        col<Company>("exchange"),
        col<Company>("updated"),
        col<FKCompany>("fk_company_currency_id")
      ));
      const values: DatabaseValue[][] = company.map((c: Company | AsString<Company>) => {
        const result: DatabaseValue[] = [
          c.company_name, 
          c.stock_ticker, 
          c.stock_price,
          c.volume_price,
          c.volume_quantity,
          c.exchange,
          c.updated,
          'EUR'
        ];

          // Double take as upsert needs two sets of the same values for both "INSERT INTO" and "UPDATE"
        return [...result, ...result];
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
