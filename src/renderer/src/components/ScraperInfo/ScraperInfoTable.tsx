import { PropsWithChildren, ReactNode } from "react";


type Props = {
  path: string;
} & PropsWithChildren;

export default function ScraperInfoTable(props: Props): ReactNode {
  const pPath = props.path;
  const pChildren: ReactNode[] | ReactNode = props.children;

  return (
    <div className="w-max-content">
      Path: {pPath}
      {/* <table className="text-align-left">
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
      </table> */}
      <div>
        {pChildren}
      </div>
    </div>
  );
}
