import { ASSETS } from "@renderer/assets/assets";
import { ScraperLogContext } from "@renderer/context/ScraperLogContext";
import { ReactNode, useContext } from "react";


export type ScraperLogEventStatus= "successful" | "pending" | "failed" | "exceptions" | "none";

export type ScraperLogEvent = {
  key: string;
  status: ScraperLogEventStatus;
  message: string;
};

export default function ScraperLog(): ReactNode {
  const {loggedEvents, scrapeResult} = useContext(ScraperLogContext);
  const badges = {
    successful: <img className="size-tiny-icon" src={ASSETS.icons.badges.successful.color} />,
    exceptions: <img className="size-tiny-icon" src={ASSETS.icons.alerts.missing.color} />,
    pending: <img className="size-tiny-icon" src={ASSETS.icons.badges.pending.color} />,
    failed: <img className="size-tiny-icon" src={ASSETS.icons.badges.failed.color} />
  };

  return (
    <div>
      {loggedEvents.map((event: ScraperLogEvent) => {
        return (
          <div key={"scraper-log-event-" + event.key}>
            <span>{event.message}</span>
            {badges[event.status] || <></>}
          </div>
        );
      })}
      <h3>Results</h3>
      <textarea
        className="w-100"
        style={{height: "200px"}}
        readOnly={true}
        value={scrapeResult ? JSON.stringify(scrapeResult.symbols, null, 2) : ""}
      />
      <h3>Errors</h3>
      <textarea
        className="w-100"
        style={{height: "200px"}}
        readOnly={true}
        value={scrapeResult ? JSON.stringify(scrapeResult.errors, null, 2) : ""}
      />
    </div>
  );
}
