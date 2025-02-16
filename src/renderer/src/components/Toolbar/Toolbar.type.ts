type Shortcut = {
  label: string;
  key: string;
};

export type ToolbarOption = {
  key: string;
  label: string;
  shortcut?: Shortcut;
  menu?: ToolbarOption[];
};
