import { DatabaseAPI } from "../../../shared/database.type";
import { Company, Currency, FKCompany } from "../../../shared/schemaConfig";
import { DatabaseManager } from "./database";
import { col, equals, from, query, select, table, where } from "./sql";


const databaseManager: DatabaseManager = new DatabaseManager(); // This should declared somewhere else!!!

export const databaseAPI: DatabaseAPI = {
  open: (databaseName: string, databasePath: string) => {
    return new Promise<Error | null>((resolve, reject) => {
      databaseManager.open(databaseName, databasePath, (err: Error | null) => {
        if( err ) {
          reject(err);
        } else {
          resolve(err);
        }
      });
    });
  },
  close: (databaseName: string) => {
    return new Promise<Error | null>((resolve, reject) => {
      databaseManager.close(databaseName, (err: Error | null) => {
        if( err ) {
          reject(err);
        } else {
          resolve(err);
        }
      });
    });
  },
  fetchAllCompanies: (databaseName: string) => {
    return new Promise<(Company & Currency)[]>(
      (resolve, reject) => {
        const preparedString: string = query(
          select(
            col<Company>("company_id", "c"), 
            col<Company>("company_name", "c"), 
            col<Company>("stock_ticker", "c"), 
            col<Company>("stock_price", "c"),
            col<Company>("volume_price", "c"),
            col<Company>("volume_quantity", "c"),
            col<Company>("updated", "c"),
            col<Currency>("currency_id", "cx")
          ) + from(
            table("company", "c"), table("currency", "cx")
          ) + where(
            equals(col<FKCompany>("fk_company_currency_id", "c"), col<Currency>("currency_id"))
          )
        );

        databaseManager.fetch<Company & Currency>(
          databaseName, preparedString, 
          (err: Error | null, rows: (Company & Currency)[]) => {
            if( err ) {
              reject(err);
            } else {
              resolve(rows);
            }
          }, []
        );
      }
    );
  }
};
