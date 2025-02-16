export type KeyConfig = {
  key: (string | null)[];
};

export type HotkeyConfig = {
  [key in string]: KeyConfig;
};
