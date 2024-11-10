import { AppStateConfig } from "@renderer/model/config";
import { createContext, Dispatch, SetStateAction } from "react";


type GlobalContextType = {
  config: {
    configuration: AppStateConfig | null;
    setConfiguration: Dispatch<SetStateAction<AppStateConfig | null>>;
  };
};

export const GlobalContext = createContext<GlobalContextType>({
  config: {
    configuration: null,
    setConfiguration: () => {}
  }
});
