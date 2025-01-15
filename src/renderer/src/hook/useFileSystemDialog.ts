import { useEffect } from "react";
import { OpenDialogCallback, SaveDialogCallback, ShowOpenDialog, ShowSaveDialog } from "src/shared/files.type";


type Props = {
  onOpenDialogResult?: OpenDialogCallback;
  onSaveDialogResult?: SaveDialogCallback;
};

type Returns = {
  showOpenFileDialog: ShowOpenDialog;
  showOpenDirectoryDialog: ShowOpenDialog;
  showSaveFileDialog: ShowSaveDialog;
};

const {filesAPI} = window.api;

export default function useFileSystemDialog(props: Props): Returns {
  const pOnOpenDialogResult: OpenDialogCallback = props.onOpenDialogResult || function() {};
  const pOnSaveDialogResult: SaveDialogCallback = props.onSaveDialogResult || function() {};

  useEffect(() => {
    const unsubscribeOpenDialog = filesAPI.onOpenDialogResult({
      callback: pOnOpenDialogResult
    });

    const unsubscribeSaveDialog = filesAPI.onSaveDialogResult({
      callback: pOnSaveDialogResult
    });

    return () => {
      unsubscribeOpenDialog();
      unsubscribeSaveDialog();
    };
  }, [
    pOnOpenDialogResult, 
    pOnSaveDialogResult
  ]);

  const showOpenDirectoryDialog = ({ key, options }) => {
    filesAPI.showOpenDialog({
      key, 
      options: {
        ...options, 
        properties: [
          ...options.properties || [], 
          "openDirectory"
        ]
      }
    });
  };

  return {
    showOpenFileDialog: filesAPI.showOpenDialog,
    showOpenDirectoryDialog: showOpenDirectoryDialog,
    showSaveFileDialog: filesAPI.showSaveDialog
  };
}
