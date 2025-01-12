import { ReactNode, useEffect, useState } from "react";
import BrowserFile from "./BrowserFile/BrowserFile";
import { FilePathParse } from "src/shared/files.type";


type Props = {
  // directoryPath: string;
}

const {filesAPI} = window.api;

export default function MaterialsBrowser(props: Props): ReactNode {
  // const pDirectoryPath: string = props.directoryPath;
  const pDirectoryPath: string = filesAPI.getWorkingDirectory() + "\\test-data\\test-database\\materials";
  const [filePaths, setFilePaths] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    filesAPI.getFilesInDirectory({ path: pDirectoryPath })
    .then((result: string[]) => setFilePaths(result))
    .catch((reason: string) => setError(reason));
  }, [pDirectoryPath]);

  const handleFileClick = (fileInfo: FilePathParse) => {
    filesAPI.execute({ command: '"' + fileInfo.dir + "\\" + fileInfo.base + '"' });
  };

  const handleOpenInExplorer = () => {
    filesAPI.execute({ command: 'explorer "' + pDirectoryPath + '"' })
  };

  if( error ) {
    return <>{error}</>;
  }

  return (
    <div>
      <button onClick={handleOpenInExplorer}>Open in system explorer</button>
      {filePaths.map((path: string) => {
        return (
          <BrowserFile
            key={path}
            fileDirectory={pDirectoryPath}
            fileName={path}
            onClick={handleFileClick}
          />
        );
      })}
    </div>
  );
}
