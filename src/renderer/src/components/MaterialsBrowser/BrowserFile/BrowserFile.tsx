import { ASSETS } from "@renderer/assets/assets";
import { ReactNode, useEffect, useState } from "react";
import { FilePathParse } from "src/shared/files.type";


type OnBrowserFileClick = (fileInfo: FilePathParse) => void;

type Props = {
  fileName: string;
  fileDirectory: string;
  onClick?: OnBrowserFileClick;
}; 

const {filesAPI} = window.api;

export default function BrowserFile(props: Props): ReactNode {
  const [info, setInfo] = useState<FilePathParse | null>(null);

  const pFileName: string = props.fileName;
  const pFileDirectory: string = props.fileDirectory;
  const pOnClick: OnBrowserFileClick = props.onClick || function() {};

  const filePath: string = pFileDirectory + "\\" + pFileName;

  useEffect(() => {
    filesAPI.parseFilePath({ path: filePath })
    .then((result: FilePathParse) => setInfo(result));
  }, [pFileName, pFileDirectory]);

  const handleFileClick = () => {
    if( info ) {
      pOnClick(info);
    }
  }

  const getFileIcon = (): string => {
    return ASSETS.icons.files[info?.ext.substring(1) || "unknown"].color || ASSETS.icons.files.unknown.white;
  };

  return (
    <div onClick={handleFileClick}>
      <img
        className="size-medium-icon"
        src={getFileIcon()}
      />
      {info?.base}
    </div>
  );
}
