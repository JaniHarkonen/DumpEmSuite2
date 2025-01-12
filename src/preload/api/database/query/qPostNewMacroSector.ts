import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { MacroSector } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { col, insertInto, query, table, val, value, values } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qPostNewMacroSector(
  databaseManager: DatabaseManager, databaseName: string, macroSector: MacroSector
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        insertInto(
          table("macro_sector"),
          col<MacroSector>("sector_id"),
          col<MacroSector>("sector_name")
        ) + values(
          value(val(), val())
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
        }, [macroSector.sector_id, macroSector.sector_name]
      );
    }
  );
}
