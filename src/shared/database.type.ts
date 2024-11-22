import { Company, Currency, Scraper } from "./schemaConfig";


export type DatabaseAPI = {
  open: (databaseName: string, databasePath: string) => Promise<Error | null>;
  close: (databaseName: string) => Promise<Error | null>;
  fetchScraperInfo: (databaseName: string) => Promise<Scraper[]>;
  fetchAllCompanies: (databaseName: string) => Promise<(Company & Currency)[]>;
};

export type BoundDatabaseAPI = {
  open: () => Promise<Error | null>;
  close: () => Promise<Error | null>;
  fetchScraperInfo: () => Promise<Scraper[]>;
  fetchAllCompanies: () => Promise<(Company & Currency)[]>;
};

export function bindAPIToWorkspace(
  workspaceID: string, workspacePath: string, api: DatabaseAPI
): BoundDatabaseAPI {
  return {
    open: () => api.open(workspaceID, workspacePath),
    close: () => api.close(workspaceID),
    fetchScraperInfo: () => api.fetchScraperInfo(workspaceID),
    fetchAllCompanies: () => api.fetchAllCompanies(workspaceID)
  };
}
