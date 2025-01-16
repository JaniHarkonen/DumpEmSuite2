import { ScraperLogEvent } from "@renderer/components/ScraperLog/ScraperLog";
import { createContext } from "react";
import { ScrapedData } from "src/shared/scraper.type";


type LogScraperEventCallback = (...updatedEvent: ScraperLogEvent[]) => void;
type LogScraperResultCallback = (result: ScrapedData) => void;
type RemoveScraperEventCallback = (...removedKey: string[]) => void;

export type ScraperLogContextType = {
  loggedEvents: ScraperLogEvent[];
  scrapeResult: ScrapedData | null;
  logEvent: LogScraperEventCallback;
  logResult: LogScraperResultCallback;
  removeEvent: RemoveScraperEventCallback;
  clearEvents: () => void;
};

export const ScraperLogContext = createContext<ScraperLogContextType>({
  loggedEvents: [],
  scrapeResult: null,
  logEvent: () => {},
  logResult: () => {},
  removeEvent: () => {},
  clearEvents: () => {}
});
