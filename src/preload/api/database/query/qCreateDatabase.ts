import { Metadata } from "../../../../shared/schemaConfig";


export default function qCreateDatabase(metadata: Metadata): string {
  return `
      /* Enforces foreign key constraints */
    PRAGMA foreign_keys = ON;

      /* Workspace metadata */
    CREATE TABLE metadata (
      dump_em_suite_version TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      workspace_name TEXT NOT NULL
    );


      /* Workspace scraper configuration */
    CREATE TABLE scraper (
      scraper_name TEXT,
      scraper_version TEXT,
      scrape_script_version TEXT,
      good_for TEXT,
      scraper_path TEXT
    );


      /* Company listings available on the workspace */
    CREATE TABLE company (
      company_id INTEGER NOT NULL,
      company_name TEXT,
      stock_ticker TEXT,
      stock_price REAL,
      volume_price REAL,
      volume_quantity REAL,
      updated TEXT,
      exchange TEXT,
      fk_company_currency_id TEXT,
      
      PRIMARY KEY (company_id AUTOINCREMENT),
      FOREIGN KEY (fk_company_currency_id) REFERENCES currency(currency_id)
    );


      /* Available currencies */
    CREATE TABLE currency (
      currency_id TEXT NOT NULL,
      currency_symbol TEXT NOT NULL,
      
      PRIMARY KEY (currency_id)
    );


      /* Available set of tags on each analysis tab */
    CREATE TABLE tag (
      tag_id INTEGER NOT NULL,
      tag_hex TEXT NOT NULL,
      tag_label TEXT,
      
      PRIMARY KEY (tag_id AUTOINCREMENT)
    );


      /* Company profiles */
    CREATE TABLE profile (
      sector TEXT,
      presence TEXT,
      investors_url TEXT,
      profile_description TEXT,
      fk_profile_company_id INTEGER NOT NULL UNIQUE,
      
      FOREIGN KEY (fk_profile_company_id) REFERENCES company(company_id) ON DELETE CASCADE
    );


      /* Filteration tabs in the order that they should appear in the app */
    CREATE TABLE filteration_step (
      step_id TEXT,
      caption TEXT,
      
      PRIMARY KEY (step_id)
    );


      /* Company analyses paired with the filteration steps that they appear in */
    CREATE TABLE filteration (
      notes TEXT,
      fk_filteration_step_id TEXT NOT NULL,
      fk_filteration_company_id INTEGER NOT NULL,
      fk_filteration_tag_id INTEGER NOT NULL DEFAULT 1,
      
      FOREIGN KEY (fk_filteration_step_id) REFERENCES filteration_step(step_id) ON DELETE CASCADE,
      FOREIGN KEY (fk_filteration_company_id) REFERENCES company(company_id) ON DELETE CASCADE,
      FOREIGN KEY (fk_filteration_tag_id) REFERENCES tag(tag_id) ON DELETE SET DEFAULT
    );


      /* Macro sector tabs in the order that they appear in the Macro-module */
    CREATE TABLE macro_sector (
      sector_id TEXT NOT NULL,
      sector_name TEXT NOT NULL,
      
      PRIMARY KEY (sector_id)
    );


      /* Macro analyses (TO BE COMPLETED) */
    CREATE TABLE macro_analysis (
      notes TEXT NULL,
      fk_macro_analysis_sector_id TEXT NOT NULL UNIQUE,
      
      FOREIGN KEY (fk_macro_analysis_sector_id) REFERENCES macro_sector(sector_id) ON DELETE CASCADE
    );


      /* INSERTS */
    INSERT INTO metadata (dump_em_suite_version, workspace_id, workspace_name)
    VALUES
    ('${metadata.dump_em_suite_version}', '${metadata.workspace_id}', '${metadata.workspace_name}');

    INSERT INTO currency (currency_id, currency_symbol)
    VALUES 
    ('EUR', '€'),
    ('USD', '$');

    INSERT INTO tag (tag_hex, tag_label)
    VALUES
    ('#C6C6C6', 'None');

    INSERT INTO filteration_step (step_id, caption)
    VALUES
    ("view-volume", "Volume"),
    ("view-price-action", "Price action"),
    ("view-technical", "Technical"),
    ("view-fundamental", "Fundamental");
  `;
}
