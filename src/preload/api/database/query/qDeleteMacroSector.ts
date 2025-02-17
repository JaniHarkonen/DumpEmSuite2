import { RunResult } from "sqlite3";
import { DeleteResult } from "../../../../shared/database.type";
import { MacroSector } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { col, DELETE, equals, FROM, query, table, val, WHERE } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";
import path, { ParsedPath } from "path";
import { RELATIVE_APP_PATHS } from "../../../../shared/appConfig";
import { rm } from "fs/promises";


export default function qDeleteMacroSector(
  databaseManager: DatabaseManager, databaseName: string, macroSectorID: string
): Promise<DeleteResult> {
  return new Promise<DeleteResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        DELETE(
          FROM(table("macro_sector")) + 
          WHERE(equals(col<MacroSector>("sector_id"), val()))
        )
      );

      const databasePath: string | null = databaseManager.getPath(databaseName);

        // Delete the associated materials directory
      if( databasePath ) {
        const parse: ParsedPath = path.parse(databasePath);
        rm(
          RELATIVE_APP_PATHS.make.sector(parse.dir, macroSectorID), 
          { recursive: true }
        );
      }

      databaseManager.post(
        databaseName, preparedString,
        (runResult: RunResult | null, err: Error | null) => {
          if( !err ) {
            resolve(destructureRunResult(runResult));
          } else {
            reject(createError(err));
          }
        }, [macroSectorID]
      );
    }
  );
}
