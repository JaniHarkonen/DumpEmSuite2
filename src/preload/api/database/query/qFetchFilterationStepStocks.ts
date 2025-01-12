import { FetchResult } from "../../../../shared/database.type";
import { Company, Currency, FKCompany, FKFilteration, Tag } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { createError } from "../databaseAPI";
import { AND, col, equals, FROM, query, SELECT, table, val, WHERE } from "../sql";


export default function qFetchFilterationStepStocks(
  databaseManager: DatabaseManager, databaseName: string, filterationStepID: string
): Promise<FetchResult<Company & Currency & Tag>> {
  return new Promise<FetchResult<Company & Currency & Tag>>(
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
          col<Currency>("currency_id", "cx"),
          col<Tag>("tag_id", "t"),
          col<Tag>("tag_hex", "t"),
          col<Tag>("tag_label", "t")
        ) + FROM(
          table("company", "c"),
          table("currency", "cx"),
          table("tag", "t"),
          table("filteration", "f")
        ) + WHERE(
          equals(
            col<FKFilteration>("fk_filteration_company_id", "f"), 
            col<Company>("company_id", "c")
          ) + AND(
            equals(
              col<FKCompany>("fk_company_currency_id", "c"), 
              col<Currency>("currency_id", "cx")
            )
          ) + AND(
            equals(
              col<FKFilteration>("fk_filteration_tag_id", "f"), 
              col<Tag>("tag_id", "t")
            )
          ) + AND(
            equals(col<FKFilteration>("fk_filteration_step_id", "f"), val())
          )
        )
      );

      databaseManager.fetch<Company & Currency & Tag>(
        databaseName, preparedString,
        (err: Error | null, rows: (Company & Currency & Tag)[]) => {
          if( !err ) {
            resolve({
              wasSuccessful: true,
              rows
            });
          } else {
            reject(createError(err));
          }
        }, [filterationStepID]
      );
    }
  );
}
