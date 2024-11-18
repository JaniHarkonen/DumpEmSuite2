export type DatabaseAPI = {
  test: () => any;
}

export const databaseAPI: DatabaseAPI = {
  test: () => {
    // const db = Database("C:\\Users\\User\\Desktop\\test-db.db", Database.OPEN_READWRITE);
    // const statement = db.prepare(`
    //   select * from TestTable;
    // `);
    
    //  return statement.all();
  }
};