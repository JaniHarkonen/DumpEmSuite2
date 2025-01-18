import { BrowserWindow, dialog } from "electron";


export function registerDialogHandles(main: Electron.IpcMain, mainWindow: BrowserWindow) {

    // Show a dialog window for opening files or directories
  main.on("show-open-dialog", (event, ...args) => {
    const {key, options} = args[0];
    dialog.showOpenDialog(options).then((result: Electron.OpenDialogReturnValue) => {
      mainWindow.webContents.send("open-dialog-result", {
        key,
        cancelled: result.canceled,
        path: result.filePaths
      });
    }).catch(() => {
      mainWindow.webContents.send("open-dialog-result", {
        cancelled: true,
        path: ""
      });
    });
  });

    // Show a dialog window for saving files
  main.on("show-save-dialog", (event, ...args) => {
    const {key, options} = args[0];
    dialog.showSaveDialog(options).then((result: Electron.SaveDialogReturnValue) => {
      mainWindow.webContents.send("save-dialog-result", {
        key,
        cancelled: result.canceled,
        path: result.filePath
      });
    }).catch(() => {
      mainWindow.webContents.send("save-dialog-result", {
        cancelled: true,
        path: ""
      });
    });
  })
}
