import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { MacroSector } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { col, equals, query, SET, table, UPDATE, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qPostMacroSectorCaption(
  databaseManager: DatabaseManager, databaseName: string, macroSector: MacroSector
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        UPDATE(table("macro_sector")) + 
        SET(equals(col<MacroSector>("sector_name"), val())) + 
        WHERE(equals(col<MacroSector>("sector_id"), val()))
      );

      databaseManager.post(
        databaseName, preparedString,
        (runResult: RunResult | null, err: Error | null) => {
          if( !err ) {
            resolve(destructureRunResult(runResult));
          } else {
            reject(createError(err));
          }
        }, [macroSector.sector_name, macroSector.sector_id]
      );
    }
  );
}
