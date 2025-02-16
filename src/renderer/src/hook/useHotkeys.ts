import { GlobalContext } from "@renderer/context/GlobalContext";
import { HotkeyContext } from "@renderer/context/HotkeyContext";
import hotkeyListener, { HeldKeyMap, HotkeyListenerReturns } from "@renderer/hotkey/hotkeyListener";
import { HotkeyConfig, KeyConfig } from "@renderer/model/hotkey";
import modifyArray from "@renderer/utils/modifyArray";
import { Nullish } from "@renderer/utils/Nullish";
import removeArrayIndex from "@renderer/utils/removeArrayIndex";
import { KeyboardEvent, useContext } from "react";


export type HotkeyActionMap<T> = {
  [key in string]: (e: KeyboardEvent<T>) => void;
}

export type HotkeyApplier = 
  <T = Element>(actionMap: HotkeyActionMap<T>) => HotkeyListenerReturns<T>;

type Returns = {
  hotkeyConfig: HotkeyConfig | undefined;
  configureHotkey: (hotkey: string | Nullish, keyConfig: string | null, index?: number) => void;
  hotkey: HotkeyApplier;
  documentHotkey: (hotkeyListener: HotkeyListenerReturns<HTMLElement>) => () => void;
};

export function hotkeyApplier<T = Element>(
  actionMap: HotkeyActionMap<T>, hotkeyConfig?: HotkeyConfig
): HotkeyListenerReturns<T> {
  return hotkeyListener((keyMap: HeldKeyMap, e: KeyboardEvent<T>) => {
    if( !hotkeyConfig ) {
      return;
    }

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

          // If filtering out all the keys that are not being held from the hotkey configuration array
          // results in an array of equal size, all the hotkeys in the configuration must have been held
          // down, and the hotkey must trigger
        if( split.filter((subKey: string) => !!keyMap[subKey]).length === split.length ) {
          actionMap[hotkeyAccessor](e);
          break;  
        }
      }
    }
  });
}

export function documentHotkeyApplier(
  hotkeyListener: HotkeyListenerReturns<HTMLElement>, doc: Document
): () => void {
  const keyDown = (e: unknown) => hotkeyListener.onKeyDown(e as KeyboardEvent<HTMLElement>);
  const keyUp = (e: unknown) => hotkeyListener.onKeyUp(e as KeyboardEvent<HTMLElement>);

  doc.addEventListener("keydown", keyDown);
  doc.addEventListener("keyup", keyUp);

  return () => {
    doc.removeEventListener("keydown", keyDown);
    doc.removeEventListener("keyup", keyUp);
  };
}

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
    return hotkeyApplier(actionMap, hotkeyConfig);
  };

  const documentHotkey = (hotkeyListener: HotkeyListenerReturns<HTMLElement>) => {
    return documentHotkeyApplier(hotkeyListener, document);
  };

  return {
    hotkeyConfig,
    configureHotkey,
    hotkey,
    documentHotkey
  };
}
