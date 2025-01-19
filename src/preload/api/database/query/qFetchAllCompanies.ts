import { FetchResult } from "../../../../shared/database.type";
import { Company, Currency, FKCompany } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { createError } from "../databaseAPI";
import { col, equals, FROM, query, SELECT, table, WHERE } from "../sql";


export default function qFetchAllCompanies(
  databaseManager: DatabaseManager, databaseName: string
): Promise<FetchResult<Company & Currency>> {
  return new Promise<FetchResult<Company & Currency>>(
    (resolve, reject) => {
      const preparedString: string = query(
        SELECT(
          col<Company>("company_id", "c"), 
          col<Company>("company_name", "c"), 
          col<Company>("stock_ticker", "c"), 
          col<Company>("stock_price", "c"),
          col<Company>("volume_price", "c"),
          col<Company>("volume_quantity", "c"),
          col<Company>("exchange", "c"),
          col<Company>("updated", "c"),
          col<Currency>("currency_id", "cx")
        ) + FROM(
          table("company", "c"), table("currency", "cx")
        ) + WHERE(
          equals(
            col<FKCompany>("fk_company_currency_id", "c"), 
            col<Currency>("currency_id", "cx")
          )
        )
      );

      databaseManager.fetch<Company & Currency>(
        databaseName, preparedString, 
        (err: Error | null, rows: (Company & Currency)[]) => {
          if( !err ) {
            resolve({
              wasSuccessful: true,
              rows
            })
          } else {
            reject(createError(err));
          }
        }, []
      );
    }
  );
}
