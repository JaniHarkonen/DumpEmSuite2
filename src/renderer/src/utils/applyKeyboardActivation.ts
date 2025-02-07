type Returns = {
  onKeyDown: (e: React.KeyboardEvent<HTMLSpanElement>) => void;
};

export default function applyKeyboardActivation(): Returns {
  return {
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      if( (e.key === "Enter" || e.key === " ") && document.activeElement === e.currentTarget ) {
        e.preventDefault();
        e.currentTarget.click();
      }
    }
  };
}
