import "./App.css";

import { MutableRefObject, ReactNode, useEffect, useRef, useState } from "react";
import { AppConfig, createConfigFileUpdater, ConfigFileUpdater } from "./model/config";
import { GlobalContext } from "./context/GlobalContext";
import { CONFIG_SAVE_DEBOUNCE_DELAY, RELATIVE_APP_PATHS } from "../../shared/appConfig";
import { SceneContext } from "./context/SceneContext";
import AppModal from "./components/AppModal/AppModal";
import { ModalContext } from "./context/ModalContext";
import { ReadResult } from "src/shared/files.type";
import WorkspacesView from "./layouts/Workspace/WorkspacesView/WorkspacesView";
import { AppTheme, ThemeContext } from "./context/ThemeContext";
import { HotkeyConfig } from "./model/hotkey";
import { HotkeyContext } from "./context/HotkeyContext";


type ConfigFileInfo = {
  appConfig: AppConfig;
  configFileUpdater: ConfigFileUpdater;
} | null;

const {filesAPI} = window.api;

export default function App(): ReactNode {
  const [configFileInfo, setConfigFileInfo] = useState<ConfigFileInfo>(null);
  const [modalElement, setModalElement] = useState<ReactNode>(undefined);
  const [activeTheme, setTheme] = useState<AppTheme>("dark");
  const [hotkeyConfig, setHotkeys] = useState<HotkeyConfig | undefined>(undefined);

    // A ref is used throughout the application to access the config instead of 
    // passing the 'configFileInfo'. This way the global app state doesn't have 
    // to be set each time the app config changes.
  const appConfigRef: MutableRefObject<AppConfig | null> = 
    useRef(configFileInfo?.appConfig || null);

  useEffect(() => {
    const configPath: string = 
      RELATIVE_APP_PATHS.make.config(filesAPI.getWorkingDirectory());
    const updater: ConfigFileUpdater = 
      createConfigFileUpdater(configPath, CONFIG_SAVE_DEBOUNCE_DELAY);

      // Read app configuration file
    filesAPI.readJSON<AppConfig>(configPath)
    .then((read: ReadResult<AppConfig>) => {
      appConfigRef.current = read.result;
      setConfigFileInfo({
        appConfig: read.result,
        configFileUpdater: updater
      });

      setTheme(read.result.activeTheme);
      setHotkeys(read.result.hotkeyConfig);
    })
    .catch((err: Error) => console.log(err));
  }, []);


  if( !configFileInfo || !appConfigRef.current ) {
    return <>Loading...</>;
  }

  return (
    <HotkeyContext.Provider value={{
      hotkeyConfig,
      setHotkeys
    }}>
      <ThemeContext.Provider value={{
        activeTheme,
        setTheme
      }}>
        <ModalContext.Provider value={{
          openModal: setModalElement,
          closeModal: () => setModalElement(undefined)
        }}>
          <GlobalContext.Provider value={{
            config: {
              appConfigRef,
              configFileUpdater: configFileInfo.configFileUpdater
            }
          }}>
            <div className="app-container">
              {modalElement && (
                <AppModal>
                  {modalElement}
                </AppModal>
              )}
              <SceneContext.Provider value={{
                sceneConfig: appConfigRef.current.sceneConfigBlueprint
              }}>
                <WorkspacesView />
              </SceneContext.Provider>
            </div>
          </GlobalContext.Provider>
        </ModalContext.Provider>
      </ThemeContext.Provider>
    </HotkeyContext.Provider>
  );
}
