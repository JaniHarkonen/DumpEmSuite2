import { ReactNode } from "react";
import TabbedView from "./components/TabbedView/TabbedView";


export default function App(): ReactNode {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  return (
    <div className="w-100 h-100 overflow-hidden">
      <TabbedView/>
    </div>
  );
}
