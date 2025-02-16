import { AppConfig, ConfigFileUpdater } from "@renderer/model/config";
import { createContext, MutableRefObject } from "react";


export type ConfigContextType = {
  appConfigRef: MutableRefObject<AppConfig | null> | null;
  activeWorkspaceIDRef: MutableRefObject<string | null> | null;
  configFileUpdater: ConfigFileUpdater;
};

export type GlobalContextType = {
  config: ConfigContextType;
};

export function defaultConfigContext(): ConfigContextType {
  return {
    appConfigRef: null,
    activeWorkspaceIDRef: null,
    configFileUpdater: () => {}
  };
}

export const GlobalContext = createContext<GlobalContextType>({
  config: defaultConfigContext()
});
