import { TabbedViewTab } from "@renderer/components/TabbedView/TabbedView";
import { Context, createContext } from "react";

type GlobalContextSchema = {
  views: {
    selection: TabbedViewTab | null;
    setSelection: (selection: TabbedViewTab | null) => void;
  }
};

export const GlobalContext: Context<GlobalContextSchema> = createContext<GlobalContextSchema>({
  views: {
    selection: null,
    setSelection: () => { }
  }
});
