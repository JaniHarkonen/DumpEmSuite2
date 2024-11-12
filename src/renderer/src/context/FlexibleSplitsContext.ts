import { UseFlexibleSplitsReturns } from "@renderer/hook/useFlexibleSplits";
import { createContext } from "react";

export type FlexibleSplitsContextType = {
  [key in keyof UseFlexibleSplitsReturns]?: UseFlexibleSplitsReturns[key];
};

export const FlexibleSplitsContext = createContext<FlexibleSplitsContextType>({});
