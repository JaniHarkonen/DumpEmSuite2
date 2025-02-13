import { KeyboardEvent } from "react";


export type HeldKeyMap = {
  [key in string]: boolean
};

type OnKeyDown<T> = (keyMap: HeldKeyMap, e: KeyboardEvent<T>) => void;
type OnKeyUp<T> = (e: KeyboardEvent<T>) => void;

export type HotkeyListenerReturns<T> = {
  onKeyDown: (e: KeyboardEvent<T>) => void;
  onKeyUp: (e: KeyboardEvent<T>) => void;
};

export function keyMapToString(keyMap: HeldKeyMap): string {
  const keys: string[] = Object.keys(keyMap);

  if( keys.length === 0 ) {
    return "";
  }

  let result: string = keys[0] === " " ? "SPACE" : keys[0];

  for( let i = 1; i < keys.length; i++ ) {
    const key: string = keys[i];
    result += " " + (key === " " ? "SPACE" : key);
  }

  return result;
}

export function stringToKeyMap(string: string): HeldKeyMap {
  const result: HeldKeyMap = {};
  string.split(" ").map((key: string) => result[key] = true);
  return result;
}

export function formatKeyString(string: string): string {
  return (
    string.split(" ")
    .reduce((previousValue: string, currentValue: string) => {
      return previousValue !== "" ? previousValue + " + " + currentValue : currentValue;
    })
  );
}

export default function hotkeyListener<T = Element>(
  onKeyDown: OnKeyDown<T>, onKeyUp?: OnKeyUp<T>
): HotkeyListenerReturns<T> {
  let keyMap: HeldKeyMap = {};

  return {
    onKeyDown: (e: KeyboardEvent<T>) => {
      keyMap[e.key === " " ? "SPACE" : e.key.toUpperCase()] = true;
      onKeyDown({...keyMap}, e);
    },
    onKeyUp: (e: KeyboardEvent<T>) => {
      keyMap = {};
      onKeyUp && onKeyUp(e);
    }
  };
}

export function mergeListeners<T = Element>(
  listeners: HotkeyListenerReturns<T>[]
): HotkeyListenerReturns<T> {
  return {
    onKeyDown: (e: KeyboardEvent<T>) => {
      for( let listener of listeners ) {
        listener.onKeyDown(e);
      }
    },
    onKeyUp: (e: KeyboardEvent<T>) => {
      for( let listener of listeners ) {
        listener.onKeyUp(e);
      }
    }
  };
}
