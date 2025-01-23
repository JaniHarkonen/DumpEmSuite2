import { ASSETS } from "@renderer/assets/assets";
import { ScraperLogContext } from "@renderer/context/ScraperLogContext";
import { ReactNode, useContext } from "react";
import StyledTextarea from "../StyledTextarea/StyledTextarea";
import Panel from "../Panel/Panel";
import StyledIcon from "../StyledIcon/StyledIcon";


export type ScraperLogEventStatus= "successful" | "pending" | "failed" | "exceptions" | "none";

export type ScraperLogEvent = {
  key: string;
  status: ScraperLogEventStatus;
  message: string;
};

type LogEventBadges = {
  [key in ScraperLogEventStatus]: ReactNode;
};

const BADGES: LogEventBadges = {
  successful: <StyledIcon src={ASSETS.icons.badges.successful.color} />,
  exceptions: <StyledIcon src={ASSETS.icons.alerts.missing.color} />,
  pending: <StyledIcon src={ASSETS.icons.badges.pending.color} />,
  failed: <StyledIcon src={ASSETS.icons.badges.failed.color} />,
  none: <></>
};

export default function ScraperLog(): ReactNode {
  const {loggedEvents, scrapeResult} = useContext(ScraperLogContext);

  return (
    <div>
      <Panel>
        {loggedEvents.map((event: ScraperLogEvent) => {
          return (
            <div key={"scraper-log-event-" + event.key}>
              <span className="mr-medium-length">{BADGES[event.status] || <></>}</span>
              <span>{event.message}</span>
            </div>
          );
        })}
      </Panel>
      <h3>Results</h3>
      <StyledTextarea
        className="w-100"
        style={{height: "200px"}}
        readOnly={true}
        value={scrapeResult ? JSON.stringify(scrapeResult.symbols, null, 2) : ""}
      />
      <h3>Errors</h3>
      <StyledTextarea
        className="w-100"
        style={{height: "200px"}}
        readOnly={true}
        value={scrapeResult ? JSON.stringify(scrapeResult.errors, null, 2) : ""}
      />
    </div>
  );
}
