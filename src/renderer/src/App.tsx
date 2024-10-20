import AdjustableGrid, { DIRECTIONS } from "./components/AdjustableGrid";
import TabbedView from "./components/TabbedView";


export default function App(): JSX.Element {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "green", display: "grid", gridTemplateRows: "auto 1fr" }}>
      <TabbedView height={24}>
      </TabbedView>
      <AdjustableGrid direction={DIRECTIONS.vertical}></AdjustableGrid>
    </div>
  );
}
