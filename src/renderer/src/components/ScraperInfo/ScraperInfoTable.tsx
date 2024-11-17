import { Nullish } from "@renderer/utils/Nullish";
import { PropsWithChildren, ReactNode } from "react";


type ScraperInfo = {
  name: string;
  scraperVersion: string;
  scrapeScriptVersion: string;
  goodForDate: string;
};

function defaultScraperInfo(): ScraperInfo {
  return {
    name: "",
    scraperVersion: "",
    scrapeScriptVersion: "",
    goodForDate: ""
  };
}

const DEFAULT_SCRAPER_INFO: ScraperInfo = defaultScraperInfo();

type Props = {
  scraperInfo: ScraperInfo | Nullish;
} & PropsWithChildren;

export default function ScraperInfoTable(props: Props): ReactNode {
  const pScraperInfo = props.scraperInfo || DEFAULT_SCRAPER_INFO;
  const pChildren: ReactNode[] | ReactNode = props.children;

  const {name: scraperName, scraperVersion, scrapeScriptVersion, goodForDate} = pScraperInfo;

  return (
    <div className="w-max-content">
      <table className="text-align-left">
        <thead>
          <tr><th>Scraper info:</th></tr>
        </thead>
        <tbody >
          <tr>
            <td></td>
            <th>Name:</th>
            <td>{scraperName}</td>
          </tr>
          <tr>
            <td></td>
            <th>Scraper version:</th>
            <td>{scraperVersion}</td>
          </tr>
          <tr>
            <td></td>
            <th>ScrapeScript version:</th>
            <td>{scrapeScriptVersion}</td>
          </tr>
          <tr>
            <td></td>
            <th>Good-for date:</th>
            <td>{goodForDate}</td>
          </tr>
        </tbody>
      </table>
      <div>
        {pChildren}
      </div>
    </div>
  );
}
