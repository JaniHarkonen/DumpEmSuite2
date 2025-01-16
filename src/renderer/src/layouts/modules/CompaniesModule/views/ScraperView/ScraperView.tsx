import "./ScraperView.css";

import PageContainer from "@renderer/components/PageContainer/PageContainer";
import useDatabase from "@renderer/hook/useDatabase";
import { ReactNode, useContext, useEffect, useState } from "react";
import { Scraper } from "src/shared/schemaConfig";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { FetchResult, PostResult } from "src/shared/database.type";
import { WorkspaceContext } from "@renderer/context/WorkspaceContext";
import PathBrowser from "@renderer/components/PathBrowser/PathBrowser";
import { TabsContext } from "@renderer/context/TabsContext";
import ScraperLog from "@renderer/components/ScraperLog/ScraperLog";
import useScraperLog from "@renderer/hook/useScraperLog";
import { CompilationResult, ScrapeResult } from "src/shared/scraper.type";
import { ScraperLogContext, ScraperLogContextType } from "@renderer/context/ScraperLogContext";


const {scraperAPI, filesAPI} = window.api;

export default function ScraperView(): ReactNode {
  const {databaseAPI} = useDatabase();
  const {workspaceConfig} = useContext(WorkspaceContext);
  const {tabs, activeTabIndex, setExtraInfo} = useContext(TabsContext);
  const scraperLogProps: ScraperLogContextType = useScraperLog();

  const tabExtraInfo: any = tabs[activeTabIndex].extra;

  const [scraperInfo, setScraperInfo] = useState<Scraper | null>(null);
  const [scrapeTarget, setScrapeTarget] = 
    useState<string | null>(tabExtraInfo?.scrapeTarget ?? null);
  const [scrapeOutput, setScrapeOutput] = 
    useState<string | null>(tabExtraInfo?.scrapeOutput ?? null);

  const fetchScraperInfo = () => {
    databaseAPI!.fetchScraperInfo()
    .then((result: FetchResult<Scraper>) => setScraperInfo(result.rows[0] ?? null));
  };

  useEffect(() => {
    fetchScraperInfo();
    scraperLogProps.logEvent({
      key: "ready",
      message: "READY!",
      status: "successful"
    });
  }, []);

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
    setExtraInfo && setExtraInfo({
      ...tabExtraInfo,
      scrapeTarget: selectedPath
    });
  };

  const handleOutputSelect = (selectedPath: string) => {
    setScrapeOutput(selectedPath);
    setExtraInfo && setExtraInfo({
      ...tabExtraInfo,
      scrapeOutput: selectedPath
    });
  };

  const handleScrape = () => {
    if( !scraperInfo || !scraperInfo.path || !scrapeTarget || !scrapeOutput ) {
      return;
    }

    scraperLogProps.clearEvents();

    scraperLogProps.logEvent({
      key: "start",
      status: "successful",
      message: "Scrape started"
    }, {
      key: "compilation",
      status: "pending",
      message: "Compiling scraper from '" + scraperInfo.path + "'..."
    });

    scraperAPI.compileScraper({ scraperPath: scraperInfo.path })
    .then((result: CompilationResult) => {
      scraperLogProps.logEvent({
        key: "compilation",
        status: "successful",
        message: "Compilation successful!"
      }, {
        key: "scrape",
        status: "pending",
        message: "Scraping target '" + scrapeTarget + "'..."
      });

      scraperAPI.scrapeFile({
        targetPath: scrapeTarget, 
        executable: result.executable
      }).then((result: ScrapeResult) => {
        scraperLogProps.logEvent({
          key: "scrape",
          status: "successful",
          message: "Scrape successful!"
        }, {
          key: "write-result",
          status: "pending",
          message: "Writing scrape result into output '" + scrapeOutput + "'..."
        });

        const scrapeResult: ScrapeResult = result;
        filesAPI.writeJSON(scrapeOutput, result.scrape).then(() => {
          const hasExceptions: boolean = (scrapeResult.scrape.errors.length > 0);
          let message: string = "Successfully scraped stock data to '" + scrapeOutput + "'!";

          if( hasExceptions ) {
            message = "Scraped stock data with EXCEPTIONS to '" + scrapeOutput + "'!";
          }

          scraperLogProps.logEvent({
            key: "write-result",
            status: "successful",
            message: "Write successful!"
          }, {
            key: "done",
            status: hasExceptions ? "exceptions" : "successful",
            message
          });

          scraperLogProps.logResult(scrapeResult.scrape);
        });
      }).catch(() => {
        scraperLogProps.logEvent({
          key: "scrape",
          status: "failed",
          message: "Unable to scrape target file '" + scrapeTarget + "'!"
        })
      });
    }).catch(() => {
      scraperLogProps.logEvent({
        key: "compilation",
        status: "failed",
        message: "Unable to compile scraper from '" + scraperInfo.path + "'!"
      });
    });
  };

  return (
    <div className="w-100 h-100 overflow-auto user-select-text">
      <PageContainer>
        <PageHeader>Scrape file</PageHeader>
        <div>
          <h3>Settings</h3>
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
        <button onClick={handleScrape}>Scrape</button>
        <h3>Log</h3>
        <div>
          <ScraperLogContext.Provider value={scraperLogProps}>
            <ScraperLog />
          </ScraperLogContext.Provider>
        </div>
      </PageContainer>
    </div>
  );
}
