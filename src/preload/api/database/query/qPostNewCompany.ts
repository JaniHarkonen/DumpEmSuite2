import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { Company, FKCompany } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { col, insertInto, query, table, val, value, values } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";
import { AsString } from "../../../../shared/utils";


export function sqlPostNewCompany(): string {
  return query(
    insertInto(
      table("company"),
      col<Company>("company_name"), 
      col<Company>("stock_ticker"), 
      col<Company>("stock_price"),
      col<Company>("volume_price"),
      col<Company>("volume_quantity"),
      col<Company>("exchange"),
      col<Company>("updated"),
      col<FKCompany>("fk_company_currency_id")
    ) + values(
      value(val(), val(), val(), val(), val(), val(), val(), val())
    )
  );
}

export default function qPostNewCompany(
  databaseManager: DatabaseManager, databaseName: string, company: Company | AsString<Company>
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string = sqlPostNewCompany();
      databaseManager.post(
        databaseName, preparedString,
        (runResult: RunResult | null, err: Error | null) => {
          if( !err ) {
            resolve(destructureRunResult(runResult));
          } else {
            reject(createError(err));
          }
        }, [
          company.company_name, 
          company.stock_ticker, 
          company.stock_price,
          company.volume_price,
          company.volume_quantity,
          company.exchange,
          company.updated,
          'EUR'
        ]
      );
    }
  );
}
