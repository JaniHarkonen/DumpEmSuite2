import "./ScraperView.css";

import PageContainer from "@renderer/components/PageContainer/PageContainer";
import useDatabase from "@renderer/hook/useDatabase";
import { ReactNode, useContext, useEffect, useState } from "react";
import { Scraper } from "src/shared/schemaConfig";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { FetchResult, PostResult } from "src/shared/database.type";
import { WorkspaceContext } from "@renderer/context/WorkspaceContext";
import PathBrowser from "@renderer/components/PathBrowser/PathBrowser";


export default function ScraperView(): ReactNode {
  const [scraperInfo, setScraperInfo] = useState<Scraper | null>(null);
  const [scrapeTarget, setScrapeTarget] = useState<string | null>(null);
  const [scrapeOutput, setScrapeOutput] = useState<string | null>(null);

  const {databaseAPI} = useDatabase();
  const {workspaceConfig} = useContext(WorkspaceContext);

  const fetchScraperInfo = () => {
    databaseAPI!.fetchScraperInfo()
    .then((result: FetchResult<Scraper>) => setScraperInfo(result.rows[0] ?? null));
  };

  useEffect(() => fetchScraperInfo(), []);

  const dialogKeySelectScraper: string = workspaceConfig.id + "-select-scraper";
  const dialogKeySelectTarget: string = workspaceConfig.id + "-select-target";
  const dialogKeySelectOutput: string = workspaceConfig.id + "-select-output";

  const warningFilePathInvalid: string = "Warning: File path is invalid!";

  const handleScraperSelect = (selectedPath: string) => {
    databaseAPI!.postScraperInfo({
      scraperInfo: {
      path: selectedPath
    }}).then((result: PostResult) => {
      if( result.wasSuccessful ) {
        fetchScraperInfo();
      }
    });
  };

  const handleTargetSelect = (selectedPath: string) => {
    setScrapeTarget(selectedPath);
  };

  const handleOutputSelect = (selectedPath: string) => {
    setScrapeOutput(selectedPath);
  };

  return (
    <div className="w-100 h-100 overflow-auto">
      <PageContainer>
        <PageHeader>Scrape file</PageHeader>
        <div>
          <h3>Select scraper</h3>
          Scraper: 
          <PathBrowser
            initialPath={scraperInfo?.path}
            actionKey={dialogKeySelectScraper}
            action="open"
            dialogProps={{
              key: dialogKeySelectScraper,
              options: {
                title: "Select scraper"
              }
            }}
            saveState={handleScraperSelect}
            nonExistingPathWarningMessage={warningFilePathInvalid}
          />
        </div>
        <h3>Results</h3>
        <div>
          <div>
            <span>Target file: </span>
            <PathBrowser
              initialPath={scrapeTarget}
              actionKey={dialogKeySelectTarget}
              action="open"
              dialogProps={{
                key: dialogKeySelectTarget,
                options: {
                  title: "Select target file to be scraped"
                }
              }}
              saveState={handleTargetSelect}
              nonExistingPathWarningMessage={warningFilePathInvalid}
            />
          </div>
          <div>
            <span>Output file: </span>
            <PathBrowser
              initialPath={scrapeOutput}
              actionKey={dialogKeySelectOutput}
              action="save"
              dialogProps={{
                key: dialogKeySelectOutput,
                options: {
                  title: "Select output file for the scrape result"
                }
              }}
              saveState={handleOutputSelect}
            />
          </div>
        </div>
        <button>Scrape</button>
      </PageContainer>
    </div>
  );
}
