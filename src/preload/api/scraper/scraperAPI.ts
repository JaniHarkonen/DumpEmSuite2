import { readFile } from "fs/promises";
import { CompilationResult, ScraperAPI, ScrapeResult } from "../../../shared/scraper.type";
import { compileFile } from "./ScrapeScript/ScrapeScript";
import execute from "./ScrapeScript/src/interpreter/interpreter";
import path from "path";


export const scraperAPI: ScraperAPI = {
  compileScraper: ({ scraperPath }) => {
    return new Promise<CompilationResult>(
      (resolve, reject) => {
        if( path.parse(scraperPath).ext !== ".ss" ) {
          reject({
            wasSuccessful: false,
            error: "ERROR: Not a ScrapeScript-file (.ss)!"
          });
        }

        try {
          resolve({
            wasSuccessful: true,
            executable: compileFile(scraperPath)
          });
        } catch( error ) {
          reject({
            wasSuccessful: false,
            error
          });
        }
      }
    );
  },
  scrapeFile: ({
    targetPath, executable
  }) => {
    return new Promise<ScrapeResult>(
      (resolve, reject) => {
        readFile(targetPath, "utf-8").then((data) => {
          try {
            resolve({
              wasSuccessful: true,
              scrape: execute(executable, [data])
            });
          } catch( error ) {
            reject({
              wasSuccessful: false,
              error
            });
          }
        }).catch((error) => reject(error));
      }
    );
  }
}