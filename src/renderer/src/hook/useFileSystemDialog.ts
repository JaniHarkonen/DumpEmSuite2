import { useEffect } from "react";
import { OpenDialogCallback, ShowOpenDialog } from "src/shared/files.type";


type Props = {
  onOpenDialogResult?: OpenDialogCallback;
};

type Returns = {
  showOpenFileDialog: ShowOpenDialog;
  showOpenDirectoryDialog: ShowOpenDialog;
};

const {filesAPI} = window.api;

export default function useFileSystemDialog(props: Props): Returns {
  const pOnOpenDialogResult: OpenDialogCallback = props.onOpenDialogResult || function() {};

  useEffect(() => {
    const unsubscribeOpenDialog = filesAPI.onOpenDialogResult({
      callback: pOnOpenDialogResult
    });

    return () => {
      unsubscribeOpenDialog();
    }
  }, []);

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
    showOpenDirectoryDialog: showOpenDirectoryDialog
  };
}
