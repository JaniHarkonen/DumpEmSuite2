export const CURRENT_APP_VERSION: string = "v2.0.2";

const materialsPath: string = "\\materials";
const sectorsPath: string = materialsPath + "\\sector";
const fundamentalsPath: string = materialsPath + "\\fundamental";
const configPath: string = "\\dump-em-config.json";

export const RELATIVE_APP_PATHS = {
  configPath,
  materialsPath,
  sectorsPath,
  fundamentalsPath,
  make: {
    database: (path: string) => path + "\\data.db",
    materials: (path: string) => path + materialsPath,
    config: (path: string) => path + configPath,
    sector: (path: string, id: string) => path + sectorsPath + "\\" + id,
    fundamental: (path: string, id: string) => path + fundamentalsPath + "\\" + id
  }
};

/**
 * Delay between a request to save the current app config and the time when the saving actually
 * happens. This will be used by the debounced app config file updater function to delay the 
 * saving process in order to avoid excessive file system calls.
 */
export const CONFIG_SAVE_DEBOUNCE_DELAY: number = 250;
