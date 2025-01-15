import useFileSystemDialog from "@renderer/hook/useFileSystemDialog";
import { ReactNode } from "react";
import { OpenDialogCallback, OpenDialogResult, SaveDialogCallback, SaveDialogResult, ShowOpenDialogProps, ShowSaveDialogProps } from "src/shared/files.type";


type Action = "open" | "save";
export type BrowseFilesDialogProps = ShowOpenDialogProps | ShowSaveDialogProps;
export type BrowseFilesDialogCallback = OpenDialogCallback | SaveDialogCallback;
export type BrowseFilesAction = Action;

type Props = {
  actionKey: string;
  action: Action;
  dialogProps: BrowseFilesDialogProps;
  onSelect?: BrowseFilesDialogCallback;
};

export type BrowseFilesProps = Props;

export default function BrowseFilesButton(props: Props): ReactNode {
  const pActionKey: string = props.actionKey;
  const pAction: Action = props.action;
  const pDialogProps: BrowseFilesDialogProps = props.dialogProps;
  const pOnSelect: BrowseFilesDialogCallback = props.onSelect || function() {};

  const handleDialog = (action: Action, result: OpenDialogResult | SaveDialogResult) => {
    if( result.key !== pActionKey || pAction !== action ) {
      return;
    }

    if( action === "save" ) {
      (pOnSelect as SaveDialogCallback)(result as SaveDialogResult);
    } else {
      (pOnSelect as OpenDialogCallback)(result as OpenDialogResult);
    }
  };

  const {showOpenFileDialog, showSaveFileDialog} = useFileSystemDialog({
    onOpenDialogResult: (result: OpenDialogResult) => handleDialog("open", result),
    onSaveDialogResult: (result: SaveDialogResult) => handleDialog("save", result)
  });
  
  const handleDialogOpen = () => {
    if( pAction === "open" ) {
      showOpenFileDialog(pDialogProps as ShowOpenDialogProps);
    } else {
      showSaveFileDialog(pDialogProps as ShowSaveDialogProps);
    }
  };

  return <button {...{onClick: handleDialogOpen}}>...</button>;
}
