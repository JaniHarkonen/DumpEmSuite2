import { Company, Currency } from "./schemaConfig";


export type DatabaseAPI = {
  open: (databaseName: string, databasePath: string) => Promise<Error | null>;
  close: (databaseName: string) => Promise<Error | null>;
  fetchAllCompanies: (databaseName: string) => Promise<(Company & Currency)[]>;
};

export type BoundDatabaseAPI = {
  open: () => Promise<Error | null>;
  close: () => Promise<Error | null>;
  fetchAllCompanies: () => Promise<(Company & Currency)[]>;
};

export function bindAPIToWorkspace(
  workspaceID: string, workspacePath: string, api: DatabaseAPI
): BoundDatabaseAPI {
  return {
    open: () => api.open(workspaceID, workspacePath),
    close: () => api.close(workspaceID),
    fetchAllCompanies: () => api.fetchAllCompanies(workspaceID)
  };
}
