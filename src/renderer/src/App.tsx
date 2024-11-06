import { ReactNode } from "react";
import Workspace from "./layouts/Workspace/Workspace";

export default function App(): ReactNode {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="w-100 h-100 overflow-hidden">
      <Workspace />
    </div>
  );
}
