import { Company, Currency, Scraper } from "./schemaConfig";


export type QueryResult = {
  wasSuccessful: boolean;
  error?: Error | null;
};

export type FetchResult<T> = {
  rows: T[];
} & QueryResult;

export type PostResult = {
  lastID: number;
  changes: number;
} & QueryResult;

export type DeleteResult = PostResult;

export type QueryProps = {
  databaseName: string;
};

export type DatabaseAPI = {
  open: (props: { databasePath: string } & QueryProps) => Promise<QueryResult>;
  close: (props: QueryProps) => Promise<QueryResult>;
  fetchScraperInfo: (props: QueryProps) => Promise<FetchResult<Scraper>>;
  fetchAllCompanies: (props: QueryProps) => Promise<FetchResult<Company & Currency>>;
  postNewCompany: (props: { company: Company } & QueryProps) => Promise<PostResult>;
};

export type BoundDatabaseAPI = {
  open: () => Promise<QueryResult>;
  close: () => Promise<QueryResult>;
  fetchScraperInfo: () => Promise<FetchResult<Scraper>>;
  fetchAllCompanies: () => Promise<FetchResult<Company & Currency>>;
  postNewCompany: (props: { company: Company }) => Promise<PostResult>;
};

export function bindAPIToWorkspace(
  workspaceID: string, workspacePath: string, api: DatabaseAPI
): BoundDatabaseAPI {
  return {
    open: () => {
      return api.open({
        databaseName: workspaceID,
        databasePath: workspacePath
      });
    },
    close: () => api.close({ databaseName: workspaceID }),
    fetchScraperInfo: () => api.fetchScraperInfo({ databaseName: workspaceID }),
    fetchAllCompanies: () => api.fetchAllCompanies({ databaseName: workspaceID }),
    postNewCompany: (props: { company: Company }) => {
      return api.postNewCompany({
        ...props,
        databaseName: workspaceID
      });
    }
  };
}
