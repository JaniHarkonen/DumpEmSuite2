export const CURRENT_APP_VERSION: string = "v2.0.0";

const materialsPath: string = "\\materials";
const sectorsPath: string = materialsPath + "\\sector";
const fundamentalsPath: string = materialsPath + "\\fundamental";
const configPath: string = "\\test-data\\config.json";

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
