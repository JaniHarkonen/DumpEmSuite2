import "./ScraperMetadataDisplay.css";

import { ScraperMetadata } from "@renderer/layouts/modules/CompaniesModule/views/ScraperView/ScraperView";
import { Nullish } from "@renderer/utils/Nullish";
import { ReactNode, useState } from "react";
import StyledTextarea from "../StyledTextarea/StyledTextarea";
import StyledButton from "../StyledButton/StyledButton";


const METADATA_LOADING_ERROR: string = 
`Metadata couldn't be located!
Should have the same path as the ScrapeScript file, except with .json extension.`

type Props = {
  scraperMetadata?: ScraperMetadata;
};

export default function ScraperMetadataDisplay(props: Props): ReactNode {
  const pScraperMetadata: ScraperMetadata | Nullish = props.scraperMetadata;
  const [show, setShow] = useState<boolean>(false);


  return (
    <div>
      <StyledButton onClick={() => setShow(!show)}>{show ? "Close" : "Metadata"}</StyledButton>
      <div className="mt-medium-length">
        {show && (
          <StyledTextarea
            className="scraper-metadata-display-textarea"
            readOnly={true}
            value={
              pScraperMetadata ? JSON.stringify(pScraperMetadata, null, 2) : 
              METADATA_LOADING_ERROR
            }
          />
        )}
      </div>
    </div>
  );
}