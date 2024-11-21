export type ErrorCallback = (err: NodeJS.ErrnoException | null) => void;
export type ParsedJSONCallback<T> = (json: T) => void;

export type ReadResult<T> = {
  wasSuccessful: boolean;
  result: T;
  info?: any;
};

export type WriteResult = {
  wasSuccessful: boolean;
  info?: any;
};

export type FilesAPI = {
  writeJSON: <T>(filePath: string, json: T) => Promise<WriteResult>;
  readJSON: <T>(filePath: string) => Promise<ReadResult<T>>;
  getWorkingDirectory: () => string;
};

