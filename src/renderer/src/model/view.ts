import { AppViewTemplate } from "@renderer/views/views.config";

export type ContentDirection = "horizontal" | "vertical";

export type DividerDirection = {
  flexDirection: "row" | "column";
  resize: "horizontal" | "vertical";
};

type Content = {
  direction: ContentDirection;
  main: AppViewTemplate | null;
  alternate?: AppViewTemplate | null;
};

export type Tab = {
  id: string;
  workspace: string;
  caption: string;
  tabs: Tab[]; // Tabs are accessible through the tab bar
  content: Content;
  activeTab?: string | null; // Tab that is active when this tab is opened
  isMinimized: boolean;
};
