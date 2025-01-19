import { ThemeContext, ThemeContextType } from "@renderer/context/ThemeContext";
import { useContext } from "react";


type Returns = {
  theme: (...baseClass: string[]) => { className: string }
} & ThemeContextType;

export default function useTheme(): Returns {
  const {activeTheme, setTheme} = useContext(ThemeContext);

  const theme = (...baseClass: string[]) => {
    let className: string = "theme-" + activeTheme;
    baseClass.forEach((clazz: string) => className += " " + clazz);
    return { className };
  };

  return {
    activeTheme,
    setTheme,
    theme
  };
}
