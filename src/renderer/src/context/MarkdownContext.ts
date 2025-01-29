import { QuarterlyEarningsProjectorState } from "@renderer/components/QuarterlyEarningsProjector/QuarterlyEarningsProjector";
import { createContext } from "react";


type Data = QuarterlyEarningsProjectorState;

export type MarkdownContextType = {
  componentData: {
    [key in string]: Data;
  };
  onComponentChange: (componentID: string, data: Data) => void;
};

export const MarkdownContext = createContext<MarkdownContextType>({
  componentData: {},
  onComponentChange: () => {}
});
