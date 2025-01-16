import { ScraperLogEvent } from "@renderer/components/ScraperLog/ScraperLog";
import { ScraperLogContextType } from "@renderer/context/ScraperLogContext";
import { MutableRefObject, useRef, useState } from "react";
import { ScrapedData } from "src/shared/scraper.type";


type ScraperLogEventsMap = Map<string, ScraperLogEvent>;

type Returns = ScraperLogContextType;

export default function useScraperLog(): Returns {
  const [loggedEvents, setLoggedEvents] = useState<ScraperLogEvent[]>([]);
  const [scrapeResult, setScrapeResult] = useState<ScrapedData | null>(null);
  const logRef: MutableRefObject<ScraperLogEventsMap> = 
    useRef<ScraperLogEventsMap>(new Map<string, ScraperLogEvent>());

  const generateEventArray = (map: ScraperLogEventsMap) => {
    const eventArray: ScraperLogEvent[] = [];

    for( let event of map ) {
      eventArray.push(event[1]);
    }

    return eventArray;
  };

  const logEvent = (...updatedEvent: ScraperLogEvent[]) => {
    updatedEvent.forEach((event: ScraperLogEvent) => logRef.current.set(event.key, event));
    setLoggedEvents(generateEventArray(logRef.current));
  };

  const logResult = (result: ScrapedData) => {
    setScrapeResult(result);
  }

  const removeEvent = (...removedKey: string[]) => {
    removedKey.forEach((key: string) => logRef.current.delete(key));
    setLoggedEvents(generateEventArray(logRef.current));
  };

  const clearEvents = () => {
    logRef.current.clear();
    generateEventArray(logRef.current);
  };

  return {
    loggedEvents, 
    scrapeResult,
    logEvent,
    logResult,
    removeEvent,
    clearEvents
  };
}
