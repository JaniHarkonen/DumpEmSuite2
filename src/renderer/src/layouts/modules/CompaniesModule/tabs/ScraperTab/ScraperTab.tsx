import PageContainer from "@renderer/components/PageContainer/PageContainer";
import "./ScraperTab.css";
import ScraperInfoTable from "@renderer/components/ScraperInfo/ScraperInfoTable";
import useDatabase from "@renderer/hook/useDatabase";
import { useEffect, useState } from "react";
import { Scraper } from "src/shared/schemaConfig";


export default function ScraperTab() {
  const {databaseAPI} = useDatabase();
  const [scraperInfo, setScraperInfo] = useState<Scraper | null>(null);

  useEffect(() => {
    databaseAPI!.fetchScraperInfo()
    .then((info: Scraper[]) => setScraperInfo(info[0]));
  }, []);


  return (
    <div className="w-100 h-100 overflow-auto">
      <PageContainer>
        <h3>Scraper configuration</h3>
        <div>
          {scraperInfo && (
            <div>
              <ScraperInfoTable
                scraperInfo={{
                  name: scraperInfo.scraper_name || "",
                  scraperVersion: scraperInfo.scraper_version || "",
                  scrapeScriptVersion: scraperInfo.scrape_script_version || "",
                  goodForDate: scraperInfo.good_for || ""
                }}
              >
                <div className="scraper-info-controls">
                  <button>Change scraper</button>
                </div>
              </ScraperInfoTable>
            </div>
          )}
        </div>
        <h3>Results</h3>
        <div>
          <div>
            <span>Target: </span><input /><button>...</button>
          </div>
          <div>
            <span>Output: </span><input /><button>...</button>
          </div>
        </div>
        Scraper status; results
      </PageContainer>
    </div>
  );
}
