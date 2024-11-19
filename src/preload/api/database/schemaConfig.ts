type Metadata = "dump_em_suite_version" | "workspace_id" | "workspace_name";
type Scraper = "scraper_name" | "scraper_version" | "scrape_script_version" | "goodForDate";
type Company = 
  "company_id" | 
  "company_name" | 
  "stock_ticker" | 
  "stock_price" | 
  "volume_price" | 
  "volume_quantity" |  
  "scrape_date" | 
  "fk_company_currency_id";
type Currency = "currency_id";
type ColorCode = "code_id" | "code_hex";
type CompanyProfile = "sector" | "presence" | "investors_url" | "profile_description" | "fk_profile_company_id";
type FilterationStep = "step_id" | "caption" | "fk_previous_step_id";
type Filteration = "notes" | "fk_filteration_step_id" | "fk_filteration_company_id" | "fk_filteration_code_id";
type Fundamental = "notes" | "fk_fundamental_company_id" | "fk_fundamental_code_id";
type MacroSector = "sector_id" | "sector_name";
type MacroAnalysis = "fk_macro_analysis_sector_id";
