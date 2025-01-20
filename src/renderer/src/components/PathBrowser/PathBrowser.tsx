import "./PathBrowser.css";

import { ChangeEvent, KeyboardEvent, ReactNode, useEffect, useState } from "react";
import BrowseFilesButton, { BrowseFilesAction, BrowseFilesProps } from "../BrowseFilesButton/BrowseFilesButton";
import { OpenDialogResult, SaveDialogResult } from "src/shared/files.type";
import { ASSETS } from "@renderer/assets/assets";


type OnPathChange = (selectedPath: string) => void;
type OnSavePathBrowserState = OnPathChange;

type Props = {
  initialPath?: string | null;
  nonExistingPathWarningMessage?: string;
  saveState?: OnSavePathBrowserState;
} & Omit<BrowseFilesProps, "onSelect">;


const {filesAPI} = window.api;

export default function PathBrowser(props: Props): ReactNode {
  const pAction: BrowseFilesAction = props.action;
  const pInitialPath: string = props.initialPath || "";
  const pNonExistingPathWarningMessage: string = props.nonExistingPathWarningMessage || "";
  const pSaveState: OnSavePathBrowserState = props.saveState || function() {};
  
  const [warning, setWarning] = useState<string | null>(null);
  const [input, setInput] = useState<string>(pInitialPath);

  const handleStateSave = (selectedPath: string = input) => pSaveState(selectedPath);

  const displayWarningIfResultInvalid = (result: boolean) => {
    if( result === false ) {
      setWarning(pNonExistingPathWarningMessage);
    } else {
      setWarning(null);
    }
  };

  useEffect(() => {
    setInput(pInitialPath);
    filesAPI.fileExists({ path: pInitialPath }).then((result: boolean) => {
      displayWarningIfResultInvalid(result);
    });
  }, [pInitialPath]);

  const handleChange = (path: string) => {
    filesAPI.fileExists({ path }).then((result: boolean) => {
      displayWarningIfResultInvalid(result);
      setInput(path);
    });
  };

  const handlePathSelection = (result: OpenDialogResult | SaveDialogResult) => {
    if( result.cancelled === false ) {
      let path: string = pAction === "open" ? result.path[0] : (result as SaveDialogResult).path;
      handleChange(path);
      handleStateSave(path);
    }
  };

  const handleEnterPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if( e.key === "Enter" ) {
      e.currentTarget.blur();
      handleStateSave();
    }
  };

  return (
    <div className="path-browser-container">
      <span>
        <BrowseFilesButton {...{
          ...props,
          onSelect: handlePathSelection
        }} />
      </span>
      <input
        className="ml-medium-length"
        type="text"
        value={input}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
        onBlur={() => handleStateSave()}
        onKeyDown={handleEnterPress}
      />
      
      {warning && (
        <>
          <span>
            <img
              className="size-tiny-icon"
              src={ASSETS.icons.alerts.missing.color}
            />
          </span>
          <span>{warning}</span>
        </>
      )}
    </div>
  );
}
