import { ReactNode, useEffect, useState } from "react";
import Workspace from "./layouts/Workspace/Workspace";
import { AppStateConfig } from "./model/config";
import { GlobalContext } from "./context/GlobalContext";
import { WorkspaceContext } from "./context/WorkspaceContext";


const {filesAPI} = window.api;

export default function App(): ReactNode {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  // ipcHandle();
  const [configuration, setConfiguration] = useState<AppStateConfig | null>(null);

  useEffect(() => {
    filesAPI.readJSON<AppStateConfig>(
      filesAPI.getWorkingDirectory() + "\\test-data\\config.json"
    ).then((result) => setConfiguration(result.result))
    .catch((err) => console.log(err));
  }, []);

  return (
    <GlobalContext.Provider value={{
        config: {
          configuration,
          setConfiguration
        }
      }}
    >
      <div className="w-100 h-100 overflow-hidden">
        {configuration && (
          <WorkspaceContext.Provider value={{ workspaceConfig: configuration.workspaces[0] }}>
            <Workspace sceneBlueprint={configuration.workspaces[0].scene.modules.splitTree} />
          </WorkspaceContext.Provider>
        )}
      </div>
    </GlobalContext.Provider>
  );
}
