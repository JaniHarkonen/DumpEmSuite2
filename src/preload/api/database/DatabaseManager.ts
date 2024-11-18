import { Database, OPEN_READWRITE } from "sqlite3";


type DatabaseConnection = {
  name: string;
  path: string;
  database: Database;
};

export type ErrorCallback = (err: Error | null) => void;

export default class DatabaseManager {
  private openDatabases: Map<string, DatabaseConnection>;

  constructor() {
    this.openDatabases = new Map<string, DatabaseConnection>();
  }


  private getDatabase(databaseName: string): DatabaseConnection | undefined {
    return this.openDatabases.get(databaseName);
  }

  public open(databaseName: string, databasePath: string, callback?: ErrorCallback): void {
    const database: Database = new Database(databasePath, OPEN_READWRITE, (err: Error | null) => {
      if( !err ) {
        this.openDatabases.set(
          databaseName, 
          {
            name: databaseName,
            path: databasePath,
            database
          }
        );
      }

      callback && callback(err);
    });
  }

  public query(databaseName: string): void {
    let database: DatabaseConnection | undefined = this.openDatabases.get(databaseName);
  }

  public fetch(databaseName: string): void {

  }

  public post(databaseName: string): void {

  }

  public delete(databaseName: string): void {

  }

  public close(databaseName: string, callback?: ErrorCallback): void {
    const database: DatabaseConnection | undefined = this.getDatabase(databaseName);

    if( database ) {
      database.database.close((err: Error | null) => {
        if( !err ) {
          this.openDatabases.delete(databaseName);
        }

        callback && callback(err);
      })
    }
  }
}
