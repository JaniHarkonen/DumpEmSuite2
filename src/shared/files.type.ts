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

export type OpenDialogResult = {
  key: string;
  cancelled: boolean;
  path: string[];
};

export type SaveDialogResult = {
  key: string;
  cancelled: boolean;
  path: string;
};

export type OpenDialogCallback = (result: OpenDialogResult) => void;

export type SaveDialogCallback = (result: SaveDialogResult) => void;

export type ShowOpenDialogProps = {
  key: string;
  options: Electron.OpenDialogOptions;
};

export type ShowSaveDialogProps = {
  key: string;
  options: Electron.SaveDialogOptions;
}

export type ShowOpenDialog = (props: ShowOpenDialogProps) => void;

export type ShowSaveDialog = (props: ShowSaveDialogProps) => void;

export type FilePathParse = {
  dir: string;
  root: string;
  base: string;
  name: string;
  ext: string;
};

type UnsubscriberCallback = () => void;

export type FilesAPI = {
  writeJSON: <T>(filePath: string, json: T) => Promise<WriteResult>;
  readJSON: <T>(filePath: string) => Promise<ReadResult<T>>;
  getWorkingDirectory: () => string;
  showOpenDialog: ShowOpenDialog;
  showSaveDialog: ShowSaveDialog;
  onOpenDialogResult: (props: { callback: OpenDialogCallback }) => UnsubscriberCallback;
  onSaveDialogResult: (props: { callback: SaveDialogCallback }) => UnsubscriberCallback;
  makeDirectory: (props: { path: string, recursive: boolean }) => Promise<string | undefined>;
  getFilesInDirectory: (props: { path: string }) => Promise<string[]>;
  parseFilePath: (props: { path: string }) => Promise<FilePathParse>;
  execute: (props: { command: string }) => void;
  copyFile: (props: { sourcePath: string, destinationPath: string }) => Promise<void>;
  deleteFile: (props: { path: string }) => Promise<void>;
  fileExists: (props: { path: string }) => Promise<boolean>;
};
