import { GlobalContext } from "@renderer/context/GlobalContext";
import { HotkeyContext } from "@renderer/context/HotkeyContext";
import { HotkeyConfig, KeyConfig } from "@renderer/model/hotkey";
import modifyArray from "@renderer/utils/modifyArray";
import { Nullish } from "@renderer/utils/Nullish";
import removeArrayIndex from "@renderer/utils/removeArrayIndex";
import { useContext } from "react";


type Returns = {
  hotkeyConfig: HotkeyConfig | undefined;
  configureHotkey: (hotkey: string | Nullish, keyConfig: string | null, index?: number) => void;
};

export default function useHotkeys(): Returns {
  const {hotkeyConfig, setHotkeys} = useContext(HotkeyContext);
  const {config} = useContext(GlobalContext);

    const configureHotkey = (
      hotkeyAccessor: string | Nullish, hotkey: string | null, index: number = -1
    ) => {
    setHotkeys((prev: HotkeyConfig | undefined) => {
      if( hotkeyConfig && hotkeyAccessor && config.appConfigRef?.current ) {
        const newConfig: HotkeyConfig = { ...prev };

          // Hotkey had no configuration -> add it
        if( !newConfig[hotkeyAccessor] ) {
          newConfig[hotkeyAccessor] = { key: [null] };
        }

        const keyConfig: KeyConfig = newConfig[hotkeyAccessor];

          // Adding an alternate key configuration
        if( index < 0 ) {
          keyConfig.key.push(null);

          if( !hotkey ) {
            config.configFileUpdater({
              ...config.appConfigRef.current,
              hotkeyConfig: newConfig
            });

            return newConfig;
          }
        }

        if( hotkey ) {
            // Modify existing key configuration
          keyConfig.key = modifyArray<string | null>(hotkey, keyConfig.key, index);
        } else {
            // Remove alternate key configuration
          const modifiedKeys: (string | null)[] = removeArrayIndex<string | null>(keyConfig.key, index);
          keyConfig.key = modifiedKeys.length === 0 ? [null] : modifiedKeys;
        }

        config.configFileUpdater({
          ...config.appConfigRef.current,
          hotkeyConfig: newConfig
        });

        return newConfig;
      }

      return prev;
    });
  };

  // const hotkey = (hotkeyAccessor: string, e: KeyboardEvent) => {
  //   return hotkeyConfig && e.key === hotkeyConfig[hotkeyAccessor.toUpperCase()];
  // };

  return {
    hotkeyConfig,
    configureHotkey
  };
}
