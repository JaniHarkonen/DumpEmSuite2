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

export type ShowOpenDialog = (props: ShowOpenDialogProps) => void;

type UnsubscriberCallback = () => void;

export type FilesAPI = {
  writeJSON: <T>(filePath: string, json: T) => Promise<WriteResult>;
  readJSON: <T>(filePath: string) => Promise<ReadResult<T>>;
  getWorkingDirectory: () => string;
  showOpenDialog: ShowOpenDialog;
  onOpenDialogResult: (props: { callback: OpenDialogCallback }) => UnsubscriberCallback;
  makeDirectory: (props: { path: string }) => Promise<void>;
};
