import { GlobalContext } from "@renderer/context/GlobalContext";
import { HotkeyContext } from "@renderer/context/HotkeyContext";
import hotkeyListener, { HeldKeyMap, HotkeyListenerReturns } from "@renderer/hotkey/hotkeyListener";
import { HotkeyConfig, KeyConfig } from "@renderer/model/hotkey";
import modifyArray from "@renderer/utils/modifyArray";
import { Nullish } from "@renderer/utils/Nullish";
import removeArrayIndex from "@renderer/utils/removeArrayIndex";
import { KeyboardEvent, useContext } from "react";


type HotkeyActionMap<T> = {
  [key in string]: (e: KeyboardEvent<T>) => void;
}

export type HotkeyApplier = 
  <T = Element>(actionMap: HotkeyActionMap<T>) => HotkeyListenerReturns<T>;

type Returns = {
  hotkeyConfig: HotkeyConfig | undefined;
  configureHotkey: (hotkey: string | Nullish, keyConfig: string | null, index?: number) => void;
  hotkey: HotkeyApplier;
};

export default function useHotkeys(): Returns {
  const {hotkeyConfig, setHotkeys} = useContext(HotkeyContext);
  const {config} = useContext(GlobalContext);

  const configureHotkey = (
    hotkeyAccessor: string | Nullish, hotkey: string | null, index: number = -1
  ) => {
    setHotkeys((prev: HotkeyConfig | undefined) => {
      if( hotkey ) {
        hotkey = hotkey.toUpperCase();
      }

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
          const modifiedKeys: (string | null)[] = 
            removeArrayIndex<string | null>(keyConfig.key, index);
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

  const hotkey = <T = Element>(actionMap: HotkeyActionMap<T>): HotkeyListenerReturns<T> => {
    return hotkeyListener((keyMap: HeldKeyMap, e: KeyboardEvent<T>) => {
      if( !hotkeyConfig ) {
        return;
      }

      const heldKeys: string[] = Object.keys(keyMap);

      for( let hotkeyAccessor of Object.keys(actionMap) ) {
        const keyConfig: KeyConfig | undefined = hotkeyConfig[hotkeyAccessor];

        if( !keyConfig ) {
          continue;
        }

        for( let key of keyConfig.key ) {
          if( !key ) {
            continue;
          }

          const split: string[] = key.split(" ");

            // Number of held keys and number of keys in the checked hotkey configuration
            // must be the same in order for there to be a match
          if( heldKeys.length !== split.length ) {
            continue;
          }

            // Number of subkeys in the checked hotkey configuration, that are also found in 
            // the held key map, must be equal to the number of keys in the key map
          if( split.filter((subKey: string) => !!keyMap[subKey]).length === heldKeys.length ) {
            actionMap[hotkeyAccessor](e);
            break;
          }
        }
      }
    });
  };

  return {
    hotkeyConfig,
    configureHotkey,
    hotkey,
  };
}
