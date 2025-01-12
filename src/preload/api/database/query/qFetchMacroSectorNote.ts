import { FetchResult } from "../../../../shared/database.type";
import { FKMacroAnalysis, MacroAnalysis } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { createError } from "../databaseAPI";
import { col, equals, FROM, query, SELECT, table, val, WHERE } from "../sql";


export default function qFetchMacroSectorNote(
  databaseManager: DatabaseManager, databaseName: string, macroSectorID: string
): Promise<FetchResult<MacroAnalysis>> {
  return new Promise<FetchResult<MacroAnalysis>>(
    (resolve, reject) => {
      const preparedString: string = query(
        SELECT(
          col<MacroAnalysis>("notes")
        ) + FROM(
          table("macro_analysis")
        ) + WHERE(
          equals(
            col<FKMacroAnalysis>("fk_macro_analysis_sector_id"), val()
          )
        )
      );

      databaseManager.fetch<MacroAnalysis>(
        databaseName, preparedString,
        (err: Error | null, rows: (MacroAnalysis)[]) => {
          if( !err ) {
            resolve({
              wasSuccessful: true,
              rows
            });
          } else {
            reject(createError(err));
          }
        }, [macroSectorID]
      );
    }
  );
}
