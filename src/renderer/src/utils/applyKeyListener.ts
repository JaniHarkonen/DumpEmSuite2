export type OnKeyDown = (e: React.KeyboardEvent<HTMLElement>) => void;

type KeyMap = {
  [key in string]: OnKeyDown;
};

type Returns = {
  onKeyDown: OnKeyDown;
};

export default function applyKeyListener(keyMap: KeyMap): Returns {
  return {
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      const action: OnKeyDown | undefined = keyMap[e.key];
      action && action(e);
    }
  };
}
