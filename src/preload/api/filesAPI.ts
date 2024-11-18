import { readFile, writeFile } from "fs/promises";


const DEFAULT_JSON_STRINGIFY_SETTINGS = {
  space: 2
};

export type ErrorCallback = (err: NodeJS.ErrnoException | null) => void;
export type ParsedJSONCallback<T> = (json: T) => void;

type ReadResult<T> = {
  wasSuccessful: boolean;
  result: T;
  info?: any;
};

type WriteResult = {
  wasSuccessful: boolean;
  info?: any;
};

export type FilesAPI = {
  writeJSON: <T>(filePath: string, json: T) => Promise<WriteResult>;
  readJSON: <T>(filePath: string) => Promise<ReadResult<T>>;
  getWorkingDirectory: () => string;
};

export const filesAPI: FilesAPI = {
  writeJSON: <T>(filePath: string, json: T) => {
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
};
