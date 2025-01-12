import { RunResult } from "sqlite3";
import { DatabaseAPI, DeleteResult, PostResult, QueryResult } from "../../../shared/database.type";
import { DatabaseManager } from "./database";
import qFetchWorkspaceStructure from "./query/qFetchWorkspaceStructure";
import qFetchScraperInfo from "./query/qFetchScraperInfo";
import qFetchAllCompanies from "./query/qFetchAllCompanies";
import qFetchAllTags from "./query/qFetchAllTags";
import qFetchCompanyProfile from "./query/qFetchCompanyProfile";
import qFetchFilterationStepStocks from "./query/qFetchFilterationStepStocks";
import qFetchFilterationStepNote from "./query/qFetchFilterationStepNote";
import qFetchMacroSectorNote from "./query/qFetchMacroSectorNote";
import qPostNewCompany from "./query/qPostNewCompany";
import qPostNewFilterationStep from "./query/qPostNewFilterationStep";
import qPostNewTag from "./query/qPostNewTag";
import qPostNewMacroSector from "./query/qPostNewMacroSector";
import qPostAllStocksFromCompanyListings from "./query/qPostAllStocksFromCompanyListings";
import qPostFilterationStepCaption from "./query/qPostFilterationStepCaption";
import qPostCompanyChanges from "./query/qPostCompanyChanges";
import qPostCompanyProfileChanges from "./query/qPostCompanyProfileChanges";
import qPostTagChanges from "./query/qPostTagChanges";
import qPostFilterationTagChanges from "./query/qPostFilterationTagChanges";
import qPostStocksToFilterationStep from "./query/qPostStocksToFilterationStep";
import qPostFilterationNoteChanges from "./query/qPostFilterationNoteChanges";
import qPostMacroSectorCaption from "./query/qPostMacroSectorCaption";
import qPostMacroSectorNoteChanges from "./query/qPostMacroSectorNoteChanges";
import qDeleteCompanies from "./query/qDeleteCompanies";
import qDeleteFilterationStep from "./query/qDeleteFilterationStep";
import qDeleteTag from "./query/qDeleteTag";
import qDelistStock from "./query/qDelistStock";
import qDeleteMacroSector from "./query/qDeleteMacroSector";


const databaseManager: DatabaseManager = new DatabaseManager(); // This should declared somewhere else!!!

export function createError(err: Error): QueryResult {
  return {
    wasSuccessful: false,
    error: err
  };
}

export function destructureRunResult(runResult: RunResult | null): PostResult | DeleteResult {
  if( !runResult ) {
    return {
      wasSuccessful: true,
      lastID: -1,
      changes: -1
    };
  } else {
    return {
      wasSuccessful: true,
      lastID: runResult.lastID,
      changes: runResult.changes
    };
  }
};

export const databaseAPI: DatabaseAPI = {
  open: ({
    databaseName,
    databasePath
  }) => {
    return new Promise<QueryResult>((resolve, reject) => {
      databaseManager.open(databaseName, databasePath, (err: Error | null) => {
        if( !err ) {
          resolve({ wasSuccessful: true });
        } else {
          reject(createError(err));
        }
      });
    });
  },
  close: ({ databaseName }) => {
    return new Promise<QueryResult>((resolve, reject) => {
      databaseManager.close(databaseName, (err: Error | null) => {
        if( !err ) {
          resolve({ wasSuccessful: true });
        } else {
          reject(createError(err));
        }
      });
    });
  },
  createDatabase: ({
    databaseID,
    databaseName,
    databasePath
  }) => {
    return new Promise<QueryResult>(
      (resolve, reject) => {
        databaseManager.create(databaseID, databaseName, databasePath, (err: Error | null) => {
          if( !err ) {
            resolve({ wasSuccessful: true });
          } else {
            reject(createError(err));
          }
        });
      }
    );
  },
  fetchWorkspaceStructure: ({
    databaseName,
    databasePath
  }) => qFetchWorkspaceStructure(databaseManager, databaseName, databasePath),
  fetchScraperInfo: ({ databaseName }) => qFetchScraperInfo(databaseManager, databaseName),
  fetchAllCompanies: ({ databaseName }) => qFetchAllCompanies(databaseManager, databaseName),
  fetchAllTags: ({ databaseName }) => qFetchAllTags(databaseManager, databaseName),
  fetchCompanyProfile: ({
    databaseName, company
  }) => {return qFetchCompanyProfile(databaseManager, databaseName, company)},
  fetchFilterationStepStocks: ({
    databaseName,
    filterationStepID
  }) => qFetchFilterationStepStocks(databaseManager, databaseName, filterationStepID),
  fetchFilterationStepNote: ({
    databaseName,
    filterationStepID,
    companyID
  }) => qFetchFilterationStepNote(databaseManager, databaseName, filterationStepID, companyID),
  fetchMacroSectorNote: ({
    databaseName,
    macroSectorID
  }) => qFetchMacroSectorNote(databaseManager, databaseName, macroSectorID),
  postNewCompany: ({
    databaseName, 
    company
  }) => qPostNewCompany(databaseManager, databaseName, company),
  postNewFilterationStep: ({
    databaseName,
    filterationStep
  }) => qPostNewFilterationStep(databaseManager, databaseName, filterationStep),
  postNewTag: ({
    databaseName,
    tag
  }) => qPostNewTag(databaseManager, databaseName, tag),
  postNewMacroSector: ({
    databaseName,
    macroSector
  }) => qPostNewMacroSector(databaseManager, databaseName, macroSector),
  postAllStocksFromCompanyListings: ({
    databaseName,
    filterationStepID,
    defaultTagID
  }) => qPostAllStocksFromCompanyListings(databaseManager, databaseName, filterationStepID, defaultTagID),
  postFilterationStepCaption: ({
    databaseName,
    filterationStep
  }) => qPostFilterationStepCaption(databaseManager, databaseName, filterationStep),
  postCompanyChanges: ({
    databaseName,
    company,
    attributes,
    values
  }) => qPostCompanyChanges(databaseManager, databaseName, company, attributes, values),
  postCompanyProfileChanges: ({
    databaseName,
    company,
    attributes,
    values
  }) => qPostCompanyProfileChanges(databaseManager, databaseName, company, attributes, values),
  postTagChanges: ({
    databaseName,
    updatedTag
  }) => qPostTagChanges(databaseManager, databaseName, updatedTag),
  postFilterationTagChanges: ({ 
    databaseName,
    filterationStepID, 
    companyID, 
    tagID 
  }) => qPostFilterationTagChanges(databaseManager, databaseName, filterationStepID, companyID, tagID),
  postStocksToFilterationStep: ({
    databaseName,
    sourceStepID,
    targetStepID,
    stockIDs,
    preserveTag,
    defaultTagID,
  }) => {
    return qPostStocksToFilterationStep(
      databaseManager, 
      databaseName, 
      sourceStepID, 
      targetStepID, 
      stockIDs, 
      preserveTag, 
      defaultTagID
    );
  },
  postFilterationNoteChanges: ({
    databaseName,
    filterationStepID,
    companyID,
    value
  }) => {
    return qPostFilterationNoteChanges(
      databaseManager, databaseName, filterationStepID, companyID, value
    );
  },
  postMacroSectorCaption: ({
    databaseName,
    macroSector
  }) => qPostMacroSectorCaption(databaseManager, databaseName, macroSector),
  postMacroSectorNoteChanges: ({
    databaseName,
    macroSectorID,
    notes
  }) => qPostMacroSectorNoteChanges(databaseManager, databaseName, macroSectorID, notes),
  deleteCompanies: ({
    databaseName, 
    companies
  }) => qDeleteCompanies(databaseManager, databaseName, companies),
  deleteFilterationStep: ({
    databaseName,
    step_id
  }) => qDeleteFilterationStep(databaseManager, databaseName, step_id),
  deleteTag: ({
    databaseName,
    tag
  }) => qDeleteTag(databaseManager, databaseName, tag),
  delistStock: ({
    databaseName,
    filterationStepID,
    companyID
  }) => qDelistStock(databaseManager, databaseName, filterationStepID, companyID),
  deleteMacroSector: ({
    databaseName,
    macroSectorID
  }) => qDeleteMacroSector(databaseManager, databaseName, macroSectorID)
};
