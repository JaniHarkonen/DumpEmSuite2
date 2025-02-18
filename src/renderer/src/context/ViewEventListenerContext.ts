import { ViewEventListenerWorkspaceMap } from "@renderer/hook/useViewEvents";
import { createContext, MutableRefObject } from "react";


type ViewEventListenerContextType = {
  eventListenersRef: MutableRefObject<ViewEventListenerWorkspaceMap> | null;
};

export const ViewEventListenerContext = createContext<ViewEventListenerContextType>({
  eventListenersRef: null
});
