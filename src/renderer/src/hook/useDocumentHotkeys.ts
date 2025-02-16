import { useEffect } from "react";
import useHotkeys, { HotkeyActionMap } from "./useHotkeys";


type Props = {
  actionMap: HotkeyActionMap<HTMLElement>;
};

export default function useDocumentHotkeys(props: Props): void {
  const pActionMap: HotkeyActionMap<HTMLElement> = props.actionMap;
  const {hotkey, documentHotkey} = useHotkeys();

  useEffect(() => {
    return documentHotkey(hotkey(pActionMap));
  }, []);
}
