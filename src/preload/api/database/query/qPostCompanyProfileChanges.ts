import { RunResult } from "sqlite3";
import { PostResult } from "../../../../shared/database.type";
import { Company, Profile } from "../../../../shared/schemaConfig";
import { DatabaseManager, DatabaseValue } from "../database";
import { upsert } from "../sql";
import { createError, destructureRunResult } from "../databaseAPI";
import { ipcRenderer } from "electron";


export default function qPostCompanyProfileChanges(
  databaseManager: DatabaseManager, 
  databaseName: string, 
  company: Company,
  attributes: (keyof Profile)[],
  setterValues: string[]
): Promise<PostResult> {
  return new Promise<PostResult>(
    (resolve, reject) => {
      const preparedString: string = upsert("profile", "fk_profile_company_id", ...attributes);
      const passedValues: DatabaseValue[] = [
        company.company_id, ...setterValues
      ];

      databaseManager.post(
        databaseName, preparedString,
        (runResult: RunResult | null, err: Error | null) => {
          if( !err ) {
            resolve(destructureRunResult(runResult));

          } else {
            reject(createError(err));
          }
        }, [...passedValues, ...passedValues] 
      );
    }
  );
}
