import PageContainer from "@renderer/components/PageContainer/PageContainer";
import "./ScraperTab.css";
import ScraperInfoTable from "@renderer/components/ScraperInfo/ScraperInfoTable";


export default function ScraperTab() {
  return (
    <div className="w-100 h-100 overflow-auto">
      <PageContainer>
        <h3>Scraper configuration</h3>
        <div>
          <div>
            <ScraperInfoTable
              scraperInfo={{
                name: "Test scraper name",
                scraperVersion: "v1.0.0",
                scrapeScriptVersion: "v1.0.0",
                goodForDate: "11-2024"
              }}
            >
              <div className="scraper-info-controls">
                <button>Change scraper</button>
              </div>
            </ScraperInfoTable>
          </div>
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
