import { HotkeyApplier } from "@renderer/hook/useHotkeys";
import { HotkeyListenerReturns } from "./hotkeyListener";

export default function blurHotkey<T = Element>(
  hotkeyApplier: HotkeyApplier
): HotkeyListenerReturns<T> {
  return hotkeyApplier({
    ""
  })
}