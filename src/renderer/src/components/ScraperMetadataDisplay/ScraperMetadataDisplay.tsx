
import { ScraperMetadata } from "@renderer/layouts/modules/CompaniesModule/views/ScraperView/ScraperView";
import { Nullish } from "@renderer/utils/Nullish";
import { ReactNode, useState } from "react";


type Props = {
  scraperMetadata?: ScraperMetadata;
}

export default function ScraperMetadataDisplay(props: Props): ReactNode {
  const pScraperMetadata: ScraperMetadata | Nullish = props.scraperMetadata;
  const [show, setShow] = useState<boolean>(false);


  return (
    <div>
      <button onClick={() => setShow(!show)}>{show ? "Close" : "Metadata"}</button>
      {show && (
        <textarea
          className="w-100"
          style={{ height: "96px" }}
          readOnly={true}
          value={
            pScraperMetadata ? JSON.stringify(pScraperMetadata, null, 2) : 
            `Metadata couldn't be located!
            Should have the same path as the ScrapeScript file, except with .json extension.`
          }
        />
      )}
    </div>
  );
}