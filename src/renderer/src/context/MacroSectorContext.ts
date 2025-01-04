import { createContext } from "react";
import { MacroSector } from "src/shared/schemaConfig";


export type MacroSectorContextType = {
  macroSector: MacroSector | null;
};

export const MacroSectorContext = createContext<MacroSectorContextType>({
  macroSector: null
});
