import { ReactNode, useEffect, useState } from "react";
import Workspace from "./layouts/Workspace/Workspace";
import { AppStateConfig } from "./model/config";
import { GlobalContext } from "./context/GlobalContext";


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
          <Workspace
            sceneBlueprint={
              configuration.workspaces[configuration.activeWorkspaceIndex]
              .scene.modules.splitTree
            }
          />
        )}
      </div>
    </GlobalContext.Provider>
  );
}
