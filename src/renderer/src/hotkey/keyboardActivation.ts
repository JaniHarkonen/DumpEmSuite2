import { OnHotkeyDown } from "./hotkey.types";



export default function keyboardActivation(): OnHotkeyDown {
  return (e: React.KeyboardEvent<HTMLElement>) => {
    if( (e.key === "Enter" || e.key === " ") && document.activeElement === e.currentTarget ) {
      e.preventDefault();
      e.currentTarget.click();
    }
  };
}
