import { Company, Currency, Filteration, FilterationStep, Profile, Scraper, Tag } from "./schemaConfig";
import { AsString } from "./utils";


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
  open: (props: { databasePath: string; } & QueryProps) => Promise<QueryResult>;
  close: (props: QueryProps) => Promise<QueryResult>;
  fetchScraperInfo: (props: QueryProps) => Promise<FetchResult<Scraper>>;
  fetchAllCompanies: (props: QueryProps) => Promise<FetchResult<Company & Currency>>;
  fetchAllTags: (props: QueryProps) => Promise<FetchResult<Tag>>;
  fetchCompanyProfile: (
    props: { company: Company; } & QueryProps
  ) => Promise<FetchResult<Profile>>;
  fetchFilterationStepStocks: (
    props: { filterationStepID: string; } & QueryProps
  ) => Promise<FetchResult<Company & Currency & Tag>>;
  fetchFilterationStepNote: (
    props: {
      filterationStepID: string;
      companyID: string;
    } & QueryProps
  ) => Promise<FetchResult<Filteration>>;
  postNewCompany: (
    props: { company: Company | AsString<Company>; } & QueryProps
  ) => Promise<PostResult>;
  postNewFilterationStep: (
    props: { filterationStep: FilterationStep; } & QueryProps
  ) => Promise<PostResult>;
  postNewTag: (props: { tag: Tag | AsString<Tag>; } & QueryProps) => Promise<PostResult>;
  postAllStocksFromCompanyListings: (
    props: { filterationStepID: string; defaultTagID: string; } & QueryProps
  ) => Promise<PostResult>;
  postCompanyChanges: (
    props: {
      company: Company;
      attributes: (keyof Company)[];
      values: string[];
    } & QueryProps
  ) => Promise<PostResult>;
  postCompanyProfileChanges: (
    props: {
      company: Company;
      attributes: (keyof Profile)[];
      values: string[];
    } & QueryProps
  ) => Promise<PostResult>;
  postTagChanges: (props: { updatedTag: Tag; } & QueryProps) => Promise<PostResult>;
  postFilterationTagChanges: (
    props: { 
      filterationStepID: string;
      companyID: string; 
      tagID: string; 
    } & QueryProps
  ) => Promise<PostResult>;
  postStocksToFilterationStep: (
    props: {
      sourceStepID: string;
      targetStepID: string;
      stockIDs: string[];
      preserveTag: boolean;
      defaultTagID: string;
    } & QueryProps
  ) => Promise<PostResult>;
  postFilterationNoteChanges: (
    props: {
      filterationStepID: string;
      companyID: string;
      value: string;
    } & QueryProps
  ) => Promise<PostResult>;
  deleteCompanies: (props: { companies: Company[]; } & QueryProps) => Promise<DeleteResult>;
  deleteFilterationStep: (props: { step_id: string; } & QueryProps) => Promise<DeleteResult>;
  deleteTag: (props: { tag: Tag; } & QueryProps) => Promise<DeleteResult>;
  delistStock: (
    props: { filterationStepID: string; companyID: string[]; } & QueryProps
  ) => Promise<DeleteResult>;
};

export type BoundDatabaseAPI = {
  open: () => Promise<QueryResult>;
  close: () => Promise<QueryResult>;
  fetchScraperInfo: () => Promise<FetchResult<Scraper>>;
  fetchAllCompanies: () => Promise<FetchResult<Company & Currency>>;
  fetchAllTags: () => Promise<FetchResult<Tag>>;
  fetchCompanyProfile: (props: { company: Company; }) => Promise<FetchResult<Profile>>;
  fetchFilterationStepStocks: (
    props: { filterationStepID: string }
  ) => Promise<FetchResult<Company & Currency & Tag>>;
  fetchFilterationStepNote: (
    props: {
      filterationStepID: string;
      companyID: string;
    }
  ) => Promise<FetchResult<Filteration>>;
  postNewCompany: (props: { company: Company | AsString<Company>; }) => Promise<PostResult>;
  postNewFilterationStep: (props: { filterationStep: FilterationStep; }) => Promise<PostResult>;
  postNewTag: (props: { tag: Tag | AsString<Tag>; }) => Promise<PostResult>;
  postAllStocksFromCompanyListings: (props: { filterationStepID: string; defaultTagID: string; }) => Promise<PostResult>;
  postCompanyChanges: (
    props: {
      company: Company;
      attributes: (keyof Company)[];
      values: string[];
    }
  ) => Promise<PostResult>;
  postCompanyProfileChanges: (
    props: {
      company: Company;
      attributes: (keyof Profile)[];
      values: string[];
    }
  ) => Promise<PostResult>;
  postTagChanges: (props: { updatedTag: Tag; }) => Promise<PostResult>;
  postFilterationTagChanges: (
    props: { 
      filterationStepID: string;
      companyID: string;
      tagID: string;
    }
  ) => Promise<PostResult>;
  postStocksToFilterationStep: (
    props: {
      sourceStepID: string;
      targetStepID: string;
      stockIDs: string[];
      preserveTag: boolean;
      defaultTagID: string;
    }
  ) => Promise<PostResult>;
  postFilterationNoteChanges: (
    props: {
      filterationStepID: string;
      companyID: string;
      value: string;
    }
  ) => Promise<PostResult>;
  deleteCompanies: (props: { companies: Company[]; }) => Promise<DeleteResult>;
  deleteFilterationStep: (props: { step_id: string; }) => Promise<DeleteResult>;
  deleteTag: (props: { tag: Tag; }) => Promise<DeleteResult>;
  delistStock: (
    props: { filterationStepID: string; companyID: string[]; }
  ) => Promise<DeleteResult>;
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
    fetchAllTags: () => api.fetchAllTags({ databaseName: workspaceID }),
    fetchCompanyProfile: (props: { company: Company }) => {
      return api.fetchCompanyProfile({
        ...props,
        databaseName: workspaceID
      });
    },
    fetchFilterationStepStocks: (props) => {
      return api.fetchFilterationStepStocks({
        ...props,
        databaseName: workspaceID
      });
    },
    fetchFilterationStepNote: (
      props: {
        filterationStepID: string;
        companyID: string;
      }
    ) => {
      return api.fetchFilterationStepNote({
        ...props,
        databaseName: workspaceID
      });
    },
    postNewCompany: (props) => {
      return api.postNewCompany({
        ...props,
        databaseName: workspaceID
      });
    },
    postNewFilterationStep: (props) => {
      return api.postNewFilterationStep({
        ...props,
        databaseName: workspaceID
      });
    },
    postNewTag: (props) => {
      return api.postNewTag({
        ...props,
        databaseName: workspaceID
      });
    },
    postAllStocksFromCompanyListings: (props) => {
      return api.postAllStocksFromCompanyListings({
        ...props,
        databaseName: workspaceID
      });
    },
    postCompanyChanges: (props) => {
      return api.postCompanyChanges({
        ...props,
        databaseName: workspaceID
      });
    },
    postCompanyProfileChanges: (props) => {
      return api.postCompanyProfileChanges({
        ...props,
        databaseName: workspaceID
      });
    },
    postTagChanges: (props) => {
      return api.postTagChanges({
        ...props,
        databaseName: workspaceID
      });
    },
    postFilterationTagChanges: (props) => {
      return api.postFilterationTagChanges({
        ...props,
        databaseName: workspaceID
      });
    },
    postStocksToFilterationStep: (props) => {
      return api.postStocksToFilterationStep({
        ...props,
        databaseName: workspaceID
      });
    },
    postFilterationNoteChanges: (props) => {
      return api.postFilterationNoteChanges({
        ...props,
        databaseName: workspaceID
      });
    },
    deleteCompanies: (props) => {
      return api.deleteCompanies({
        ...props,
        databaseName: workspaceID
      });
    },
    deleteFilterationStep: (props) => {
      return api.deleteFilterationStep({
        ...props,
        databaseName: workspaceID
      });
    },
    deleteTag: (props) => {
      return api.deleteTag({
        ...props,
        databaseName: workspaceID
      });
    },
    delistStock: (props) => {
      return api.delistStock({
        ...props,
        databaseName: workspaceID
      });
    }
  };
}
