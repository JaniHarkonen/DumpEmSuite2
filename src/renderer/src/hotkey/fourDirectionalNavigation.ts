import { HotkeyApplier } from "@renderer/hook/useHotkeys";
import { HotkeyListenerReturns } from "./hotkeyListener";
import { Nullish } from "@renderer/utils/Nullish";
import { KeyboardEvent } from "react";


type EventSettings = {
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

type ElementGetter = (e: KeyboardEvent<HTMLElement>) => HTMLElement | null;

export default function fourDirectionalNavigation<T extends HTMLElement>(
  hotkeyApplier: HotkeyApplier,
  getLeft?: ElementGetter, 
  getRight?: ElementGetter, 
  getUp?: ElementGetter, 
  getDown?: ElementGetter, 
  eventSettings?: EventSettings
): HotkeyListenerReturns<T> {
  const focusOnNext = (
    e: KeyboardEvent<T>, targetGetter: ElementGetter | Nullish
  ) => {
    if( eventSettings ) {
      eventSettings.preventDefault && e.preventDefault();
      eventSettings.stopPropagation && e.stopPropagation();
    }

    if( targetGetter ) {
      const target: HTMLElement | null = targetGetter(e);

      if( target ) {
        target.focus();
      }
    }
  };

  return hotkeyApplier({
    "navigate-up": (e: KeyboardEvent<T>) => focusOnNext(e, getUp),
    "navigate-down": (e: KeyboardEvent<T>) => focusOnNext(e, getDown),
    "navigate-left": (e: KeyboardEvent<T>) => focusOnNext(e, getLeft),
    "navigate-right": (e: KeyboardEvent<T>) => focusOnNext(e, getRight),
  });
}
