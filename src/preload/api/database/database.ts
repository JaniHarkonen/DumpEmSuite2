import { Database, OPEN_READWRITE } from "sqlite3";


function compound(...components: string[]): string {
  if( components.length === 0 ) {
    return "";
  }

  let compoundString: string = components[0];
  for( let i = 1; i < components.length; i++ ) {
    compoundString += ", " + components[i];
  }

  return compoundString;
}

export function query(queryString: string): string {
  return queryString + ";";
}

export function subquery(queryString: string): string {
  return " (" + queryString + ")";
}

export function col<T>(columnString: keyof T, tableReference?: string): string {
  return (tableReference ? tableReference + "." : "") + (columnString as string);
}

export function table(tableString: string, tableReference?: string): string {
  return tableString + (tableReference ? " " + tableReference : "");
}

export function select(...column: string[]): string {
  return "SELECT " + compound(...column);
}

export function from(...table: string[]): string {
  return " FROM " + compound(...table);
}

export function where(whereString: string): string {
  return " WHERE " + whereString;
}

export function equals(columnStringA: string, columnStringB: string): string {
  return columnStringA + "=" + columnStringB;
}

export function and(conditionStringA: string, conditionStringB: string): string {
  return " " + conditionStringA + " AND " + conditionStringB;
}

export function insertInto(
  tableString: string, ...columnString: string[]
): string {
  return "INSERT INTO " + tableString + "(" + compound(...columnString) + ")";
}

export function values(...valueString: string[]): string {
  return (
    " VALUES " + compound(...valueString.map((str: string) => "(" + str + ")"))
  );
}

export function val(valueString?: string): string {
  return valueString ? valueString : "?";
}


type DatabaseConnection = {
  name: string;
  path: string;
  database: Database;
};

export type ErrorCallback = (err: Error | null) => void;

export class DatabaseManager {
  private openDatabases: Map<string, DatabaseConnection>;

  constructor() {
    this.openDatabases = new Map<string, DatabaseConnection>();
    const name: string = "test";
    const path: string = process.cwd() + "\\test-data\\test-database.db";
    this.openDatabases.set(name, { name, path, database: new Database(path) });
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
  }

  public fetch<T>(
    databaseName: string, 
    preparedString: string, 
    callback: (err: Error | null, rows: T[]) => void,
    values: (number | string | boolean | null)[]
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

  public post(databaseName: string, preparedString: string): void {

  }

  public delete(databaseName: string, preparedString: string): void {

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
