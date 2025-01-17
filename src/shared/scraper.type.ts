import { Company } from "./schemaConfig";

export type ScraperEvent = 
  "ready" | "start" | "compilation" | "scrape" | "write-result" | "done" | "summary";

export type CompilationResult = {
  wasSuccessful: boolean;
  executable?: any;
  error?: any;
};

export type ScrapeResult = {
  wasSuccessful: boolean;
  scrape?: any;
  error?: any;
};

export type ScrapedStock = Omit<Company, "company_id">;

export type ScrapedData = {
  symbols: ScrapedStock[];
  errors: string[];
};

export type ScraperAPI = {
  compileScraper: (props: { scraperPath: string }) => Promise<CompilationResult>;
  scrapeFile: (props: {
    targetPath: string, executable: any
  }) => Promise<ScrapeResult>;
};
