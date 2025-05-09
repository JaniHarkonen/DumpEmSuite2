import "./App.css";

import { MutableRefObject, ReactNode, useEffect, useRef, useState } from "react";
import { AppConfig, createConfigFileUpdater, ConfigFileUpdater } from "./model/config";
import { GlobalContext } from "./context/GlobalContext";
import { CONFIG_SAVE_DEBOUNCE_DELAY, RELATIVE_APP_PATHS } from "../../shared/appConfig";
import { SceneContext } from "./context/SceneContext";
import AppModal from "./components/AppModal/AppModal";
import { ModalContext } from "./context/ModalContext";
import { ReadResult, WriteResult } from "src/shared/files.type";
import WorkspacesView from "./layouts/Workspace/WorkspacesView/WorkspacesView";
import { AppTheme, ThemeContext } from "./context/ThemeContext";
import { HotkeyConfig } from "./model/hotkey";
import { HotkeyContext } from "./context/HotkeyContext";
import { documentHotkeyApplier, hotkeyApplier } from "./hook/useHotkeys";
import { SplitTreeForkBlueprint, SplitTreeNodeBlueprint, SplitTreeValueBlueprint } from "./model/splits";
import { TabBlueprint } from "./model/tabs";
import { ViewEventListenerWorkspaceMap } from "./hook/useViewEvents";
import { ViewEventListenerContext } from "./context/ViewEventListenerContext";
import buildAppConfig from "./json/buildAppConfig";


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

  const activeWorkspaceIDRef: MutableRefObject<string | null> =
    useRef(null);

  const eventListenersRef: MutableRefObject<ViewEventListenerWorkspaceMap> = 
    useRef<ViewEventListenerWorkspaceMap>({});

  useEffect(() => {
    const configPath: string = 
      RELATIVE_APP_PATHS.make.config(filesAPI.getWorkingDirectory())
    const updater: ConfigFileUpdater = 
      createConfigFileUpdater(configPath, CONFIG_SAVE_DEBOUNCE_DELAY);

    const readAppConfig = () => {
      filesAPI.readJSON<AppConfig>(configPath)
      .then((read: ReadResult<AppConfig>) => {
        appConfigRef.current = read.result;

          // Determine the first open workspace by finding the left-most value node in the
          // split tree of the scene configuration
        let left: SplitTreeNodeBlueprint | null = (
          appConfigRef.current.sceneConfigBlueprint.splitTree.root as SplitTreeNodeBlueprint ?? null
        );

        while( left ) {
          if( (left as SplitTreeValueBlueprint).value ) {
            break;
          } else {
            left = (left as SplitTreeForkBlueprint).left;
          }
        }

        const leftValue: SplitTreeValueBlueprint | null = left as (SplitTreeValueBlueprint | null);
        const tab: TabBlueprint | undefined = leftValue?.value.tabs[leftValue?.value.activeTabIndex ?? -1];
        activeWorkspaceIDRef.current = tab?.id ?? null;

        setConfigFileInfo({
          appConfig: read.result,
          configFileUpdater: updater
        });

        setTheme(read.result.activeTheme);
        setHotkeys(read.result.hotkeyConfig);
      })
      .catch((err: Error) => console.log(err));
    };

      // Read app configuration file
    filesAPI.fileExists({ path: configPath })
    .then((exists: boolean) => {
      if( !exists ) {
        filesAPI.writeJSON<AppConfig>(configPath, buildAppConfig())
        .then((writeResult: WriteResult) => {
          if( writeResult.wasSuccessful ) {
            readAppConfig();
          }
        });
      } else {
        readAppConfig();
      }
    });
  }, []);

  useEffect(() => {
    return documentHotkeyApplier(
      hotkeyApplier({
        "blur": () => {
          const activeElement: HTMLElement | null = document.activeElement as (HTMLElement | null);
          activeElement && activeElement.blur();
        }
      }, hotkeyConfig), document
    );
  }, [hotkeyConfig]);


  if( !configFileInfo || !appConfigRef.current ) {
    return <>Loading...</>;
  }

  return (
    <ViewEventListenerContext.Provider value={{
      eventListenersRef
    }}>
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
                activeWorkspaceIDRef,
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
    </ViewEventListenerContext.Provider>
  );
}
