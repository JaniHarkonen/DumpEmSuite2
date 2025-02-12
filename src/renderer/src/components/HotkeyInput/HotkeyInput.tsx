import { KeyboardEvent, ReactNode, useMemo } from "react";
import StyledInput from "../StyledInput/StyledInput";
import StyledButton from "../StyledButton/StyledButton";
import { ASSETS } from "@renderer/assets/assets";
import hotkeyListener, { formatKeyString, HeldKeyMap, HotkeyListenerReturns, keyMapToString } from "@renderer/hotkey/hotkeyListener2";
import { Nullish } from "@renderer/utils/Nullish";
import useStateRef from "@renderer/hook/useStateRef";


type OnHotkeySelect = (hotkey: string | null) => void;

type Props = {
  hotkey?: string | Nullish;
  onSelect?: OnHotkeySelect;
};

export default function HotkeyInput(props: Props): ReactNode {
  const pHotkey: string | null = props.hotkey ?? null;
  const pOnSelect: OnHotkeySelect = props.onSelect || function(){ };

  const [hotkey, setHotkey, hotkeyRef] = useStateRef<string | null>(pHotkey);

    // Memoize the hotkey setter to avoid resetting the hotkey listener each time a key is pressed
  const listener: HotkeyListenerReturns<HTMLInputElement> = 
    useMemo<HotkeyListenerReturns<HTMLInputElement>>(() => {
      return hotkeyListener(
        (keyMap: HeldKeyMap, e: KeyboardEvent<HTMLDivElement>) => {
          e.preventDefault();
          e.stopPropagation();
          setHotkey(keyMapToString(keyMap));
        }, 
        (e: KeyboardEvent<HTMLInputElement>) => {
          (e.target as HTMLDivElement).blur();
          pOnSelect(hotkeyRef.current);
        }
      );
    }, []);
    
  const handleClear = () => {
    setHotkey(null);
    pOnSelect(null);
  };

  return (
    <div className="d-flex">
      <StyledInput
        readOnly={true}
        value={hotkey === " " ? "SPACE" : formatKeyString((hotkey || "<NONE>").toUpperCase())}
        {...listener}
      />
      <StyledButton
        className="ml-medium-length"
        icon={ASSETS.icons.action.trashCan.black}
        onClick={handleClear}
      />
    </div>
  );
}
