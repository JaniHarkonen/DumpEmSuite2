import StyledIcon from "@renderer/components/StyledIcon/StyledIcon";
import "./BrowserFile.css";

import { ASSETS } from "@renderer/assets/assets";
import useTheme from "@renderer/hook/useTheme";
import { ReactNode, useEffect, useState } from "react";
import { FilePathParse } from "src/shared/files.type";


type OnBrowserFileClick = (fileInfo: FilePathParse) => void;
type OnBrowserFileDelete = OnBrowserFileClick;

type Props = {
  fileName: string;
  fileDirectory: string;
  onClick?: OnBrowserFileClick;
  onDelete?: OnBrowserFileDelete;
}; 

const {filesAPI} = window.api;

export default function BrowserFile(props: Props): ReactNode {
  const pFileName: string = props.fileName;
  const pFileDirectory: string = props.fileDirectory;
  const pOnClick: OnBrowserFileClick = props.onClick || function() {};
  const pOnDelete: OnBrowserFileDelete = props.onDelete || function() {};

  const [info, setInfo] = useState<FilePathParse | null>(null);

  const {theme} = useTheme();

  const filePath: string = pFileDirectory + "\\" + pFileName;

  useEffect(() => {
    filesAPI.parseFilePath({ path: filePath })
    .then((result: FilePathParse) => setInfo(result));
  }, [pFileName, pFileDirectory]);

  const handleFileClick = () => {
    info && pOnClick(info);
  };

  const handleFileDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    info && pOnDelete(info);
  };

  const getFileIcon = (): string => {
    return ASSETS.icons.files[
      info?.ext.substring(1) || "unknown"
    ]?.black || ASSETS.icons.files.unknown.black;
  };

  return (
    <div
      {...theme("highlight-hl", "browser-file-container")}
      onClick={handleFileClick}
    >
      <button
        {...theme("highlight-hl", "browser-file-delete-button")}
        onClick={handleFileDelete}
      >
        <StyledIcon src={ASSETS.icons.action.trashCan.black} />
      </button>
      <img
        {...theme("script-svg", "size-small-icon mr-medium-length")}
        src={getFileIcon()}
      />
      {info?.base}
    </div>
  );
}
