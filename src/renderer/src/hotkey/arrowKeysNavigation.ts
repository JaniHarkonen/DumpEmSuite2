import { Nullish } from "@renderer/utils/Nullish";
import { OnHotkeyDown } from "./hotkey.types";


type EventSettings = {
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

type ElementGetter = (e: React.KeyboardEvent<HTMLElement>) => HTMLElement | null;

function focusIfAvailable(
  e: React.KeyboardEvent<HTMLElement>, targetGetter: ElementGetter | Nullish
): void {
  if( targetGetter ) {
    const target: HTMLElement | null = targetGetter(e);
    
    if( target ) {
      target.focus();
    }
  }
}

export default function arrowKeysNavigation(
  getLeft?: ElementGetter, 
  getRight?: ElementGetter, 
  getUp?: ElementGetter, 
  getDown?: ElementGetter, 
  eventSettings?: EventSettings
): OnHotkeyDown {
  const settings: EventSettings = eventSettings ?? {
    preventDefault: true,
    stopPropagation: false,
  };

  return (e: React.KeyboardEvent<HTMLElement>) => {
    const key: string = e.key;

    switch( key ) {
      case "ArrowLeft": focusIfAvailable(e, getLeft); break;
      case "ArrowRight": focusIfAvailable(e, getRight); break;
      case "ArrowUp": focusIfAvailable(e, getUp); break;
      case "ArrowDown": focusIfAvailable(e, getDown); break;
      default: return;
    }

    if( settings.preventDefault ) {
      e.preventDefault();
    }

    if( settings.stopPropagation ) {
      e.stopPropagation();
    }
  }
}
