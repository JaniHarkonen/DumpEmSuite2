import { Database, OPEN_READWRITE } from "sqlite3";
import { DatabaseManager, ErrorCallback } from "./database";


export type DatabaseAPI = {
  open: (databaseName: string, databasePath: string, errorCallback?: ErrorCallback) => void;
  close: (databaseName: string, errorCallback?: ErrorCallback) => void;
  fetch: (databaseName: string) => void;
};

const databaseManager: DatabaseManager = new DatabaseManager();

export const databaseAPI: DatabaseAPI = {
  open: (databaseName: string, databasePath: string, errorCallback?: ErrorCallback) => {
    databaseManager.open(databaseName, databasePath, errorCallback);
  },
  close: (databaseName: string, errorCallback?: ErrorCallback) => {
    databaseManager.close(databaseName, errorCallback);
  },
  fetch: (databaseName: string) => {

  }
  // test: (errorCallback?: ErrorCallback) => {
  //   const db: Database = new Database("test-db.db", OPEN_READWRITE);
  //   return db.all(`select * from TestTable;`, setter);
  //   // const db = Database("test-db.db", Database.OPEN_READWRITE);
  //   // const statement = db.prepare(`
  //   //   select * from TestTable;
  //   // `);
    
  //   //  return statement.all();
  // }
};
