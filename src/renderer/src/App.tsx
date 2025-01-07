import "./App.css";

import { MutableRefObject, ReactNode, useEffect, useRef, useState } from "react";
import Workspace from "./layouts/Workspace/Workspace";
import { AppStateConfig, createConfigFileUpdater, ConfigFileUpdater } from "./model/config";
import { GlobalContext } from "./context/GlobalContext";
import { RELATIVE_APP_PATHS } from "./app.config";
import { SceneContext } from "./context/SceneContext";
import Toolbar from "./components/Toolbar/Toolbar";
import AppModal from "./components/AppModal/AppModal";
import { ModalContext } from "./context/ModalContext";
import { ReadResult } from "src/shared/files.type";


type ConfigFileInfo = {
  appStateConfig: AppStateConfig;
  configFileUpdater: ConfigFileUpdater;
} | null;

const {filesAPI} = window.api;

export default function App(): ReactNode {
  const [configFileInfo, setConfigFileInfo] = useState<ConfigFileInfo>(null);
  const [modalElement, setModalElement] = useState<ReactNode>(undefined);

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
    .then((read: ReadResult<AppStateConfig>) => {
      appStateConfigRef.current = read.result;
      setConfigFileInfo({
        appStateConfig: read.result,
        configFileUpdater: updater
      });
    })
    .catch((err: Error) => console.log(err));
  }, []);


  if( !configFileInfo || !appStateConfigRef.current ) {
    return <>Loading...</>;
  }

  return (
    <ModalContext.Provider value={{
        openModal: setModalElement,
        closeModal: () => setModalElement(undefined)
      }}
    >
      <GlobalContext.Provider value={{
          config: {
            appStateConfigRef: appStateConfigRef,
            configFileUpdater: configFileInfo.configFileUpdater
          }
        }}
      >
        <div className="app-container">
          {modalElement && (
            <AppModal>
              {modalElement}
            </AppModal>
          )}
          <Toolbar />
          <SceneContext.Provider
            value={{
              sceneConfig: appStateConfigRef.current.workspaces[0].sceneConfig
            }}
          >
            <Workspace workspaceConfig={appStateConfigRef.current.workspaces[0]} />
          </SceneContext.Provider>
        </div>
      </GlobalContext.Provider>
    </ModalContext.Provider>
  );
}
