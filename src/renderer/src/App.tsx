import TabbedView, { Tab } from "./components/TabbedView/TabbedView";
import WorkspaceView from "./WorkspaceView/WorkspaceView";

export default function App(): JSX.Element {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="w-100 h-100">
    <TabbedView 
      height={24}
      tabs={[
        Tab("ws-16889", "Test workspace 1", WorkspaceView),
        Tab("ws-23147", "Test again", WorkspaceView)
      ]}
    ></TabbedView>
    </div>
  );
}
