import { readFile, writeFile, mkdir } from "fs/promises";
import { FilesAPI, ReadResult } from "../../shared/files.type";
import { ipcRenderer } from "electron";


const DEFAULT_JSON_STRINGIFY_SETTINGS = {
  space: 2
};

export const filesAPI: FilesAPI = {
  writeJSON: (filePath: string, json: any) => {
    return new Promise((resolve, reject) => {
      writeFile(filePath, JSON.stringify(json, null, DEFAULT_JSON_STRINGIFY_SETTINGS.space))
      .then(() => resolve({
        wasSuccessful: true
      })).catch((err) => reject({
        wasSuccessful: false,
        info: err
      }));
    });
  },
  readJSON: <T>(filePath: string) => {
    return (
      new Promise<ReadResult<T>>((resolve, reject) => {
        readFile(filePath, "utf-8")
        .then((jsonString: string) => resolve({
          wasSuccessful: true, 
          result: JSON.parse(jsonString)
        })).catch((err) => reject({
          wasSuccessful: false, 
          info: err
        }));
      })
    );
  },
  getWorkingDirectory: () => process.cwd(),
  showOpenDialog: ({
    key,
    options
  }) => {
    ipcRenderer.send("show-open-dialog", {
      key,
      options: {
        ...options,
        properties: [
          ...options.properties || [],
          "dontAddToRecent",
        ]
      }
    });
  },
  onOpenDialogResult: ({ callback }) => {
    const eventCallback = (event: Electron.IpcRendererEvent, ...args: any[]) => callback(args[0]);
    ipcRenderer.on("open-dialog-result", eventCallback);
    return () => ipcRenderer.removeListener("open-dialog-result", eventCallback);
  },
  makeDirectory: ({ path }) => mkdir(path, { recursive: false })
};
