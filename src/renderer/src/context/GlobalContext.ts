import { Tab } from "@renderer/model/view";
import { Context, createContext } from "react";

type GlobalContextSchema = {
  viewRef: React.MutableRefObject<Tab> | null;
};

export const GlobalContext: Context<GlobalContextSchema> = createContext<GlobalContextSchema>({
  viewRef: null
});
