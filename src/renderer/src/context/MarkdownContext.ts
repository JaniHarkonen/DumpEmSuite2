import { createContext } from "react";


export type MarkdownContextType = {
  markdown: string;
  onComponentChange: (updatedMarkdown: string) => void;
};

export const MarkdownContext = createContext<MarkdownContextType>({
  markdown: "",
  onComponentChange: () => {}
});
