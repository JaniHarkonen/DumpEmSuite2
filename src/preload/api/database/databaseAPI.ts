import { RunResult } from "sqlite3";
import { DatabaseAPI, FetchResult, PostResult, QueryResult } from "../../../shared/database.type";
import { Company, Currency, FKCompany, Scraper } from "../../../shared/schemaConfig";
import { DatabaseManager } from "./database";
import { col, equals, from, insertInto, query, select, table, val, value, values, where } from "./sql";


const databaseManager: DatabaseManager = new DatabaseManager(); // This should declared somewhere else!!!

function createError(err: Error): QueryResult {
  return {
    wasSuccessful: false,
    error: err
  };
}

export const databaseAPI: DatabaseAPI = {
  open: ({
    databaseName,
    databasePath
  }) => {
    return new Promise<QueryResult>((resolve, reject) => {
      databaseManager.open(databaseName, databasePath, (err: Error | null) => {
        if( !err ) {
          resolve({ wasSuccessful: true });
        } else {
          reject(createError(err));
        }
      });
    });
  },
  close: ({ databaseName }) => {
    return new Promise<QueryResult>((resolve, reject) => {
      databaseManager.close(databaseName, (err: Error | null) => {
        if( !err ) {
          resolve({ wasSuccessful: true });
        } else {
          reject(createError(err));
        }
      });
    });
  },
  fetchScraperInfo: ({ databaseName }) => {
    return new Promise<FetchResult<Scraper>>(
      (resolve, reject) => {
        const preparedString: string = query(
          select(col("*")) + 
          from(table("scraper"))
        );
        
        databaseManager.fetch<Scraper>(
          databaseName, preparedString,
          (err: Error | null, rows: Scraper[]) => {
            if( !err ) {
              resolve({
                wasSuccessful: true,
                rows
              });
            } else {
              reject(createError(err))
            }
          }, []
        );
      }
    );
  },
  fetchAllCompanies: ({ databaseName }) => {
    return new Promise<FetchResult<Company & Currency>>(
      (resolve, reject) => {
        const preparedString: string = query(
          select(
            col<Company>("company_id", "c"), 
            col<Company>("company_name", "c"), 
            col<Company>("stock_ticker", "c"), 
            col<Company>("stock_price", "c"),
            col<Company>("volume_price", "c"),
            col<Company>("volume_quantity", "c"),
            col<Company>("exchange", "c"),
            col<Company>("chart_url", "c"),
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
  },
  postNewCompany: ({
    databaseName, 
    company
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          insertInto(
            table("company"),
            col<Company>("company_name"), 
            col<Company>("stock_ticker"), 
            col<Company>("stock_price"),
            col<Company>("volume_price"),
            col<Company>("volume_quantity"),
            col<Company>("exchange"),
            col<Company>("chart_url"),
            col<Company>("updated"),
            col<FKCompany>("fk_company_currency_id")
          ) + values(
            value(val(), val(), val(), val(), val(), val(), val(), val(), val())
          )
        );
        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve({
                wasSuccessful: true,
                lastID: runResult?.lastID ?? -1,
                changes: runResult?.changes ?? -1
              })
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
            company.chart_url,
            company.updated,
            'EUR'
          ]
        );
      }
    );
  }
};
