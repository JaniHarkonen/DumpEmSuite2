import { Company, Currency, Profile, Scraper } from "./schemaConfig";


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
  fetchCompanyProfile: (
    props: { company: Company } & QueryProps
  ) => Promise<FetchResult<Profile>>;
  postNewCompany: (props: { company: Company } & QueryProps) => Promise<PostResult>;
  postCompanyChanges: (
    props: {
      company: Company, 
      attributes: (keyof Company)[], 
      values: string[] 
    } & QueryProps
  ) => Promise<PostResult>;
  postCompanyProfileChanges: (
    props: {
      company: Company,
      attributes: (keyof Profile)[],
      values: string[]
    } & QueryProps
  ) => Promise<PostResult>;
  deleteCompanies: (props: { companies: Company[] } & QueryProps) => Promise<DeleteResult>;
};

export type BoundDatabaseAPI = {
  open: () => Promise<QueryResult>;
  close: () => Promise<QueryResult>;
  fetchScraperInfo: () => Promise<FetchResult<Scraper>>;
  fetchAllCompanies: () => Promise<FetchResult<Company & Currency>>;
  fetchCompanyProfile: (props: { company: Company }) => Promise<FetchResult<Profile>>;
  postNewCompany: (props: { company: Company }) => Promise<PostResult>;
  postCompanyChanges: (
    props: {
      company: Company, 
      attributes: (keyof Company)[], 
      values: string[] 
    }
  ) => Promise<PostResult>;
  postCompanyProfileChanges: (
    props: {
      company: Company,
      attributes: (keyof Profile)[],
      values: string[]
    }
  ) => Promise<PostResult>;
  deleteCompanies: (props: { companies: Company[] }) => Promise<DeleteResult>;
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
    fetchCompanyProfile: (props: { company: Company }) => api.fetchCompanyProfile({
      ...props,
      databaseName: workspaceID
    }),
    postNewCompany: (props: { company: Company }) => {
      return api.postNewCompany({
        ...props,
        databaseName: workspaceID
      });
    },
    postCompanyChanges: (
      props: {
        company: Company, 
        attributes: (keyof Company)[], 
        values: string[] 
      }
    ) => {
      return api.postCompanyChanges({
        ...props,
        databaseName: workspaceID
      });
    },
    postCompanyProfileChanges: (
      props: {
        company: Company,
        attributes: (keyof Profile)[],
        values: string[]
      }
    ) => {
      return api.postCompanyProfileChanges({
        ...props,
        databaseName: workspaceID
      });
    },
    deleteCompanies: (props: { companies: Company[] }) => {
      return api.deleteCompanies({
        ...props,
        databaseName: workspaceID
      });
    }
  };
}
