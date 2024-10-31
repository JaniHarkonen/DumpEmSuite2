import { AppViewTemplate } from "@renderer/views/views.config";

export type ContentDirection = "horizontal" | "vertical";

export type DividerDirection = {
  flexDirection: "row" | "column";
  resize: "horizontal" | "vertical";
};

export type Section = {
  hasTabs: boolean;
  //parentTabID: string;
  //parentTabWorkspace: string;
  //placement: "main" | "alternative";
  content: Tab[] | AppViewTemplate;
};

export type SectionPlacement = "main" | "alternative";

export type TabSections = {
  direction: ContentDirection;
  main: Section;
  alternate?: Section;
};

export type Tab = {
  id: string;
  workspace: string;
  caption: string;
  sections: TabSections;
  activeTab?: string | null; // Tab that is active when this tab is opened
  isMinimized: boolean;
};
