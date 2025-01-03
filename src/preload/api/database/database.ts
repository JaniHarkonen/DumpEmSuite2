import { Database, OPEN_READWRITE, RunResult } from "sqlite3";


type DatabaseConnection = {
  name: string;
  path: string;
  database: Database;
};

type DatabaseValue = number | string | boolean | null;

export type ErrorCallback = (err: Error | null) => void;

export class DatabaseManager {
  private openDatabases: Map<string, DatabaseConnection>;

  constructor() {
    this.openDatabases = new Map<string, DatabaseConnection>();
  }


  private getDatabase(databaseName: string): DatabaseConnection | undefined {
    return this.openDatabases.get(databaseName);
  }

  public open(
    databaseName: string, databasePath: string, callback?: ErrorCallback
  ): void {
    const database: Database = 
      new Database(databasePath, OPEN_READWRITE, (err: Error | null) => {
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
    const connection: DatabaseConnection | undefined = 
      this.getDatabase(databaseName);

    if( connection ) {
      connection.database.close((err: Error | null) => {
        if( !err ) {
          this.openDatabases.delete(databaseName);
        }

        callback && callback(err);
      });
    }
  }
}
