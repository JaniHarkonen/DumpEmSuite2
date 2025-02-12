import { HotkeyConfig } from "@renderer/model/hotkey";
import { createContext, Dispatch, SetStateAction } from "react";


type SetHotkeys = Dispatch<SetStateAction<HotkeyConfig | undefined>>;

export type HotkeyContextType = {
  setHotkeys: SetHotkeys;
  hotkeyConfig?: HotkeyConfig;
};

export const HotkeyContext = createContext<HotkeyContextType>({
  setHotkeys: () => {}
});
