import { MutableRefObject, ReactNode, useEffect, useRef, useState } from "react";
import Workspace from "./layouts/Workspace/Workspace";
import { AppStateConfig, createConfigFileUpdater, ConfigFileUpdater } from "./model/config";
import { GlobalContext } from "./context/GlobalContext";
import { RELATIVE_APP_PATHS } from "./app.config";
import { SceneContext } from "./context/SceneContext";


type ConfigFileInfo = {
  appStateConfig: AppStateConfig;
  configFileUpdater: ConfigFileUpdater;
} | null;

const {filesAPI} = window.api;

export default function App(): ReactNode {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  // ipcHandle();
  const [configFileInfo, setConfigFileInfo] = useState<ConfigFileInfo>(null);

    // A ref is used throughout the application to access the config instead of 
    // passing the 'configFileInfo'. This way the global app state doesn't have 
    // to be set each time the app config changes.
  const appStateConfigRef: MutableRefObject<AppStateConfig | null> = 
    useRef(configFileInfo?.appStateConfig || null);

  useEffect(() => {
    const configPath: string = 
      filesAPI.getWorkingDirectory() + RELATIVE_APP_PATHS.configPath;
    const updater: ConfigFileUpdater = createConfigFileUpdater(configPath);

      // Read app configuration file
    filesAPI.readJSON<AppStateConfig>(configPath)
    .then((read) => {
      appStateConfigRef.current = read.result;
      setConfigFileInfo({
        appStateConfig: read.result,
        configFileUpdater: updater
      });
    })
    .catch((err) => console.log(err));
  }, []);


  if( !configFileInfo || !appStateConfigRef.current ) {
    return <>Loading...</>;
  }

  return (
    <GlobalContext.Provider value={{
        config: {
          appStateConfigRef: appStateConfigRef,
          configFileUpdater: configFileInfo.configFileUpdater
        }
      }}
    >
      <div className="w-100 h-100 overflow-hidden">
        <SceneContext.Provider
          value={{
            sceneConfig: appStateConfigRef.current.workspaces[0].scene
          }}
        >
          <Workspace />
        </SceneContext.Provider>
      </div>
    </GlobalContext.Provider>
  );
}
