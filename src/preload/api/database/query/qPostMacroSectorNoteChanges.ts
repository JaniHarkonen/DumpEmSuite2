import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { FKMacroAnalysis, MacroAnalysis } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { col, query, replaceInto, table, val, value, values } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";


export default function qPostMacroSectorNoteChanges(
  databaseManager: DatabaseManager, databaseName: string, macroSectorID: string, notes: string
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string = query(
        replaceInto(
          table("macro_analysis"), 
          col<MacroAnalysis>("notes"), 
          col<FKMacroAnalysis>("fk_macro_analysis_sector_id")
        ) + values(value(val(), val()))
      );

      databaseManager.post(
        databaseName, preparedString,
        (runResult: RunResult | null, err: Error | null) => {
          if( !err ) {
            resolve(destructureRunResult(runResult));
          } else {
            reject(createError(err));
          }
        }, [notes, macroSectorID]
      );
    }
  );
}
