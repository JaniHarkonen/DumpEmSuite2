import { ipcRenderer } from "electron";
import { FetchResult } from "../../../../shared/database.type";
import { Company, FKProfile, Profile } from "../../../../shared/schemaConfig";
import { DatabaseManager } from "../database";
import { createError } from "../databaseAPI";
import { col, equals, FROM, query, SELECT, table, val, WHERE } from "../sql";


export default function qFetchCompanyProfile(
  databaseManager: DatabaseManager, databaseName: string, company: Company
): Promise<FetchResult<Profile>> {
  return new Promise<FetchResult<Profile>>(
    (resolve, reject) => {
      const preparedString: string = query(
        SELECT(
          col<Profile>("investors_url"), 
          col<Profile>("presence"),
          col<Profile>("profile_description"),
          col<Profile>("sector")
        ) + 
        FROM(table("profile")) + 
        WHERE(equals(col<FKProfile>("fk_profile_company_id"), val()))
      );

      ipcRenderer.send("debug", preparedString)
      ipcRenderer.send("debug", company.company_id)

      databaseManager.fetch<Profile>(
        databaseName, preparedString,
        (err: Error | null, rows: Profile[]) => {
          if( !err ) {
            resolve({
              wasSuccessful: true,
              rows
            });
          } else {
            reject(createError(err));
          }
        }, [company.company_id]
      );
    }
  );
}
