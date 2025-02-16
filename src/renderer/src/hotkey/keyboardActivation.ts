import { HotkeyApplier } from "@renderer/hook/useHotkeys";
import { HotkeyListenerReturns } from "./hotkeyListener";
import { KeyboardEvent } from "react";


export default function keyboardActivation<T extends HTMLElement>(
  hotkeyApplier: HotkeyApplier
): HotkeyListenerReturns<T> {
  return hotkeyApplier({
    "activate": (e: KeyboardEvent<T>) => {
      e.preventDefault();
      e.currentTarget.click();
    }
  });
}
