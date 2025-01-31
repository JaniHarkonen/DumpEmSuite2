import { createContext } from "react";


export type AppTheme = "light" | "dark";

export type SetTheme = (theme: AppTheme) => void;

export type ThemeContextType = {
  activeTheme: AppTheme;
  setTheme?: SetTheme;
};

export const ThemeContext = createContext<ThemeContextType>({
  activeTheme: "dark"
});
