import { AppStateConfig, ConfigFileUpdater } from "@renderer/model/config";
import { createContext, MutableRefObject } from "react";


export type ConfigContextType = {
  appStateConfigRef: MutableRefObject<AppStateConfig | null> | null;
  configFileUpdater: ConfigFileUpdater;
};

export type GlobalContextType = {
  config: ConfigContextType;
};

export function defaultConfigContext(): ConfigContextType {
  return {
    appStateConfigRef: null,
    configFileUpdater: () => {}
  };
}

export const GlobalContext = createContext<GlobalContextType>({
  config: defaultConfigContext()
});
