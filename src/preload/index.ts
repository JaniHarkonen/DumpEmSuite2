import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { filesAPI } from './api/filesAPI';
import { databaseAPI } from './api/database/databaseAPI';
import { FilesAPI } from '../shared/files.type';
import { DatabaseAPI } from '../shared/database.type';
import { ScraperAPI } from '../shared/scraper.type';
import { scraperAPI } from "./api/scraper/scraperAPI";


export type APIs = {
  filesAPI: FilesAPI;
  databaseAPI: DatabaseAPI;
  scraperAPI: ScraperAPI;
};

const api: APIs = {
  filesAPI,
  databaseAPI,
  scraperAPI
};

if ( process.contextIsolated ) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
}
