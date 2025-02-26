import { GlobalContext } from "@renderer/context/GlobalContext";
import { AppTheme, ThemeContext, ThemeContextType } from "@renderer/context/ThemeContext";
import { useContext } from "react";


type Returns = {
  theme: (...baseClass: string[]) => { className: string };
} & ThemeContextType;

export default function useTheme(): Returns {
  const {activeTheme, setTheme} = useContext(ThemeContext);
  const {config} = useContext(GlobalContext);

  const theme = (...baseClass: string[]) => {
    let className: string = "theme-" + activeTheme;
    baseClass.forEach((clazz: string) => className += " " + clazz);
    return { className };
  };

  const handleThemeChange = (t: AppTheme) => {
    if( setTheme && config.appConfigRef?.current ) {
      config.appConfigRef.current.activeTheme = t;
      setTheme(t);
      config.configFileUpdater({
        ...config.appConfigRef.current,
        activeTheme: t
      });
    }
  };

  return {
    activeTheme,
    setTheme: handleThemeChange,
    theme
  };
}
