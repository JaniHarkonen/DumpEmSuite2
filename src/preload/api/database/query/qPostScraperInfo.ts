import { PostResult } from "../../../../shared/database.type";
import { col, table, upsert } from "../sql";
import { Scraper } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { RunResult } from "sqlite3";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qPostScraperInfo(
  databaseManager: DatabaseManager, databaseName: string, scraperInfo: Scraper
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string = upsert(
        table("scraper"), col<Scraper>("unique_column"), col<Scraper>("path")
      );
      
      databaseManager.post(
        databaseName, preparedString,
        (result: RunResult | null, err: Error | null) => {
          if( !err ) {
            resolve(destructureRunResult(result));
          } else {
            reject(createError(err));
          }
        }, [1, scraperInfo.path, 1, scraperInfo.path]
      );
    }
  );
}
