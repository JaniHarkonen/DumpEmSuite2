import "./MaterialsBrowser.css";
import { ReactNode, useEffect, useState } from "react";
import BrowserFile from "./BrowserFile/BrowserFile";
import { FilePathParse } from "src/shared/files.type";
import StyledButton from "../StyledButton/StyledButton";
import CompanyNotSelected from "../CompanyNotSelected/CompanyNotSelected";
import { ASSETS } from "@renderer/assets/assets";
import useTabKeys from "@renderer/hook/useTabKeys";


type Props = {
  directoryPath: string;
};

export type MaterialsBrowserProps = Props;

const {filesAPI} = window.api;

export default function MaterialsBrowser(props: Props): ReactNode {
  const pDirectoryPath: string = props.directoryPath;
  const [filePaths, setFilePaths] = useState<string[]>([]);
  const dialogKey: string = "materials-browser-import-" + pDirectoryPath;

  const {formatKey} = useTabKeys();

  const importFiles = (path: string[]) => {
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
    .catch(() => setFilePaths([]));

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
    const files: string[] = [];
    e.preventDefault();
    
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

  if( !pDirectoryPath ) {
    return <CompanyNotSelected />;
  }

  return (
    <div
      className="materials-browser-container"
      onDrop={handleFileImportDrop}
      onDragOver={ignoreDragOver}
    >
      <div className="m-medium-length">
        <StyledButton
          className="mr-medium-length"
          onClick={handleFileImportSelection}
          icon={ASSETS.icons.buttons.import.black}
        >
          Import files
        </StyledButton>
        <StyledButton
          onClick={handleOpenInExplorer}
          icon={ASSETS.icons.buttons.link.black}
        >
          Open in system explorer
        </StyledButton>
      </div>
      <div className="w-100 h-100">
        <div className="materials-browser-file-container">
          {filePaths.length > 0 ? filePaths.map((path: string, index: number) => {
            return (
              <div
                key={formatKey(path)}
                className="materials-browser-file-item-container"
              >
                <BrowserFile
                  fileDirectory={pDirectoryPath}
                  fileName={path}
                  onClick={handleFileClick}
                  onDelete={(fileInfo: FilePathParse) => removeFile(index, fileInfo)}
                />
              </div>
            );
          }) : <div>No materials yet.</div>}
          </div>
      </div>
    </div>
  );
}
