import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { FilesAPI, filesAPI } from './api/filesAPI';


export type APIs = {
  filesAPI: FilesAPI;
};

const api: APIs = {
  filesAPI
};

if ( process.contextIsolated ) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
}
