import { useContext, useState } from "react";
import TabbedView, { Tab, TabbedViewTab } from "./components/TabbedView/TabbedView";
import WorkspaceView from "./WorkspaceView/WorkspaceView";
import { GlobalContext } from "./context/GlobalContext";

export default function App(): JSX.Element {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const context = useContext(GlobalContext);
  const [testSelection, setTextSelection] = useState<TabbedViewTab | null>(context.views.selection);

  return (
    <GlobalContext.Provider value={{views: {selection: testSelection, setSelection: setTextSelection}}}>
      <div className="w-100 h-100 overflow-hidden">
        <TabbedView 
          height={24}
          tabs={[
            Tab("ws-16889", "Test workspace 1", WorkspaceView),
            Tab("ws-23147", "Test again", WorkspaceView)
          ]}
          allowMinimization={true}
        ></TabbedView>
      </div>
    </GlobalContext.Provider>
  );
}
