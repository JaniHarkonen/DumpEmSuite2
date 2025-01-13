import { ReactNode, useEffect, useState } from "react";
import BrowserFile from "./BrowserFile/BrowserFile";
import { FilePathParse } from "src/shared/files.type";
import { RELATIVE_APP_PATHS } from "../../../../../src/shared/appConfig";


type Props = {
  // directoryPath: string;
}

const {filesAPI} = window.api;

export default function MaterialsBrowser(props: Props): ReactNode {
  // const pDirectoryPath: string = props.directoryPath;
  const pDirectoryPath: string | null = (
    filesAPI.getWorkingDirectory() + 
    "\\test-data\\test-database\\" + 
    RELATIVE_APP_PATHS.materialsPath
  );

  const [filePaths, setFilePaths] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const dialogKey: string = "materials-browser-import-" + pDirectoryPath;

  const importFiles = (path: string[]) => {
    console.log("copy", path)
    for( let file of path ) {
      filesAPI.parseFilePath({ path: file })
      .then((parse: FilePathParse) => {
        filesAPI.copyFile({
          sourcePath: file,
          destinationPath: pDirectoryPath + "\\" + parse.base
        }).then(() => {
          setFilePaths((prev: string[]) => [...prev, parse.base]);
        });
      });
    }
  };

  useEffect(() => {
    filesAPI.getFilesInDirectory({ path: pDirectoryPath })
    .then((result: string[]) => setFilePaths(result))
    .catch((reason: string) => setError(reason));

    return filesAPI.onOpenDialogResult({
      callback: ({ key, cancelled, path }) => {
        if( cancelled ) {
          return;
        }

        if( key === dialogKey ) {
          importFiles(path);
        }
      }
    });
  }, [pDirectoryPath]);

  const handleFileClick = (fileInfo: FilePathParse) => {
    filesAPI.execute({ command: '"' + fileInfo.dir + "\\" + fileInfo.base + '"' });
  };

  const handleOpenInExplorer = () => {
    filesAPI.execute({ command: 'explorer "' + pDirectoryPath + '"' })
  };

  const ensureMaterialsDirectoryExists = (after: () => void) => {
    filesAPI.makeDirectory({
      path: pDirectoryPath,
      recursive: true
    }).finally(after);
  };

  const handleFileImportSelection = () => {

      // Attempt to create the directory in case it doesn't already exist
    ensureMaterialsDirectoryExists(() => {
      filesAPI.showOpenDialog({
        key: dialogKey,
        options: {
          title: "Select files to import",
          properties: [
            "multiSelections"
          ]
        }
      });
    });
  };

  const handleFileImportDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const files: string[] = [];
    for( let i = 0; i < e.dataTransfer.files.length; i++ ) {
      files.push(e.dataTransfer.files[i].path);
    }

    ensureMaterialsDirectoryExists(() => importFiles(files));
  };

  const ignoreDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (index: number, fileInfo: FilePathParse) => {
    filesAPI.deleteFile({ path: fileInfo.dir + "\\" + fileInfo.base })
    .then(() => setFilePaths((prev: string[]) => {
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    }));
  };

  if( error ) {
    return <>{error}</>;
  }

  if( !pDirectoryPath ) {
    return <>Please, select a company...</>;
  }

  return (
    <div
      onDrop={handleFileImportDrop}
      onDragOver={ignoreDragOver}
    >
      <button onClick={handleFileImportSelection}>Import files</button>
      <button onClick={handleOpenInExplorer}>Open in system explorer</button>
      {filePaths.map((path: string, index: number) => {
        return (
          <BrowserFile
            key={path}
            fileDirectory={pDirectoryPath}
            fileName={path}
            onClick={handleFileClick}
            onDelete={(fileInfo: FilePathParse) => removeFile(index, fileInfo)}
          />
        );
      })}
    </div>
  );
}
