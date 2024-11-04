import { ReactNode } from "react";
import SplitView from "./components/SplitView/SplitView";

export default function App(): ReactNode {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="w-100 h-100 overflow-hidden">
      <SplitView />
    </div>
  );
}
