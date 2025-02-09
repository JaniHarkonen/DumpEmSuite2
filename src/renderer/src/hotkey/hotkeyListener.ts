import { OnHotkeyDown } from "./hotkey.types";


type KeyMap = {
  [key in string]: OnHotkeyDown;
};

// export type ApplyKeyListenerReturns = Returns;

export default function hotkeyListener(keyMap: KeyMap): OnHotkeyDown {
  return (e: React.KeyboardEvent<HTMLElement>) => {
    const action: OnHotkeyDown | undefined = keyMap[e.key];
    action && action(e);
  };
}
