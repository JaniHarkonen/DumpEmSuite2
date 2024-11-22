import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { FilesAPI, filesAPI } from './api/filesAPI';
import { DatabaseAPI, databaseAPI } from './api/database/databaseAPI';


export type APIs = {
  filesAPI: FilesAPI;
  databaseAPI: DatabaseAPI
};

const api: APIs = {
  filesAPI,
  databaseAPI
};

if ( process.contextIsolated ) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
}
