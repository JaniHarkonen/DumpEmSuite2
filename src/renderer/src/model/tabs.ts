import { ReactNode } from "react";

export type Tab = {
  id: string;
  workspace: string;
  caption: string;
  content: ReactNode;
};
