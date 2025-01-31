import { readFile, writeFile, mkdir, readdir, copyFile, unlink } from "fs/promises";
import { FilePathParse, FilesAPI, ReadResult } from "../../shared/files.type";
import { ipcRenderer } from "electron";
import { parse, ParsedPath } from "path";
import { exec } from "child_process";
import { existsSync } from "fs";


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
    key, options
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
  showSaveDialog: ({
    key, options
  }) => {
    ipcRenderer.send("show-save-dialog", {
      key, options,
      ...options,
      properties: [
        ...options.properties || [],
        "dontAddToRecent"
      ]
    });
  },
  onOpenDialogResult: ({ callback }) => {
    const eventCallback = (event: Electron.IpcRendererEvent, ...args: any[]) => callback(args[0]);
    ipcRenderer.on("open-dialog-result", eventCallback);
    return () => ipcRenderer.removeListener("open-dialog-result", eventCallback);
  },
  onSaveDialogResult: ({ callback }) => {
    const eventCallback = (event: Electron.IpcRendererEvent, ...args: any[]) => callback(args[0]);
    ipcRenderer.on("save-dialog-result", eventCallback);
    return () => ipcRenderer.removeListener("save-dialog-result", eventCallback);
  },
  makeDirectory: ({ path, recursive }) => mkdir(path, { recursive }),
  getFilesInDirectory: ({ path }) => readdir(path),
  parseFilePath: ({ path }) => {
    return new Promise<FilePathParse>(
      (resolve, reject) => {
        try {
          const parsedPath: ParsedPath = parse(path);
          resolve(parsedPath);
        } catch( err ) {
          reject(err);
        }
      }
    );
  },
  execute: ({ command }) => exec(command),
  copyFile: ({ sourcePath, destinationPath }) => copyFile(sourcePath, destinationPath),
  deleteFile: ({ path }) => unlink(path),
  fileExists: ({ path }) => new Promise<boolean>((resolve) => resolve(existsSync(path)))
};
