import { Database, OPEN_CREATE, OPEN_READWRITE, RunResult } from "sqlite3";
import qCreateDatabase from "./query/qCreateDatabase";
import { CURRENT_APP_VERSION } from "../../../shared/appConfig";


type DatabaseConnection = {
  name: string;
  path: string;
  database: Database;
};

export type DatabaseValue = number | string | boolean | null;

export type ErrorCallback = (err: Error | null) => void;

export class DatabaseManager {
  private openDatabases: Map<string, DatabaseConnection>;

  constructor() {
    this.openDatabases = new Map<string, DatabaseConnection>();
  }


  private getDatabase(databaseName: string): DatabaseConnection | undefined {
    return this.openDatabases.get(databaseName);
  }

  public create(
    databaseID: string, databaseName: string, databasePath: string, callback?: ErrorCallback
  ): void {
    const database: Database = 
      new Database(databasePath, OPEN_CREATE | OPEN_READWRITE, (openError: Error | null) => {
        if( openError ) {
          callback && callback({
            name: "create-error",
            message: "Database '" + databaseName + "' could not be created! Path: " + databasePath
          });
        } else {
          database.exec(qCreateDatabase({
            dump_em_suite_version: CURRENT_APP_VERSION,
            workspace_id: databaseID,
            workspace_name: databaseName
          }), (createError: Error | null) => {
            if( createError ) {
              database.close((closeError: Error | null) => callback && callback(closeError));
            } else {
              database.close();
              callback && callback(createError);
            }
          });
        }
      });
  }

  public open(
    databaseName: string, databasePath: string, callback?: ErrorCallback
  ): void {
    const database: Database = 
      new Database(databasePath, OPEN_READWRITE, (err: Error | null) => {
          // Abort if database is already open
        if( this.openDatabases.has(databaseName) ) {
          callback && callback({
            name: "already-open", 
            message: "Database '" + databaseName + "' is already open!"
          });
          return;
        }

        if( !err ) {
          this.openDatabases.set(databaseName, {
            name: databaseName,
            path: databasePath,
            database
          });
        }

        callback && callback(err);
      });

      // Enforces foreign key constraints (ensures that cascading updates, such as 
      // "ON DELETE CASCADE" are carried out)
    database.exec("PRAGMA foreign_keys = ON;");
  }

  public fetch<T>(
    databaseName: string, 
    preparedString: string, 
    callback: (err: Error | null, rows: T[]) => void,
    values: DatabaseValue[]
  ): void {
    const connection: DatabaseConnection | undefined = this.getDatabase(databaseName);

    if( !connection ) {
      callback(new Error(
        "Unable to connect to database! No database with name '" + databaseName + 
        "' was registered."
      ), []);
    } else {
      connection.database.prepare(preparedString, values).all<T>(callback);
    }
  }

  public fetchMultiple(
    databaseName: string,
    preparedString: string[],
    values: DatabaseValue[][],
    fields: string[],
    callback: (err: Error | null, result: any) => void
  ): void {
    const promises: Promise<any>[] = [];
    
    for( let i = 0; i < preparedString.length; i++ ) {
      const prepared: string = preparedString[i];
      const value: DatabaseValue[] = values[i];
      promises.push(new Promise<any>((resolve, reject) => {
        this.fetch<any>(
          databaseName, 
          prepared, 
          (err: Error | null, rows: any[]) => {
            if( !err ) {
              resolve(rows);
            } else {
              reject(new Error("Failed to execute the query!"));
            }
          }, 
          value
        );
      }));
    }

    Promise.all(promises).then((results: any[]) => {
      const finalResult: any = {};

      for( let i = 0; i < results.length; i++ ) {
        finalResult[fields[i]] = results[i];
      }
      
      callback(null, finalResult);
    }).catch((err: Error) => callback(err, null));
  }

  public post(
    databaseName: string, 
    preparedString: string, 
    callback: (result: RunResult | null, err: Error | null) => void, 
    values: DatabaseValue[]
  ): void {
    const connection: DatabaseConnection | undefined = this.getDatabase(databaseName);

    if( !connection ) {
      callback(null, new Error(
        "Unable to connect to database! No database with name '" + databaseName + 
        "' was registered."
      ));
    } else {
      connection.database.prepare(preparedString).run(values, callback);
    }
  }

  public close(databaseName: string, callback?: ErrorCallback): void {
    const connection: DatabaseConnection | undefined = this.getDatabase(databaseName);

    if( connection ) {
      connection.database.close((err: Error | null) => {
        if( !err ) {
          this.openDatabases.delete(databaseName);
        }

        callback && callback(err);
      });
    }
  }

  public getPath(databaseName: string): string | null {
    const connection: DatabaseConnection | undefined = this.getDatabase(databaseName);
    return connection?.path ?? null;
  }
}
