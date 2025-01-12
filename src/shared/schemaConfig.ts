export type Metadata = {
  dump_em_suite_version: string;
  workspace_id: string; 
  workspace_name: string;
};

export type Scraper = {
  scraper_name: string | null;
  scraper_version: string | null;
  scrape_script_version: string | null;
  good_for: string | null;
  scraper_path: string | null;
};

export type Company = {
  company_id: number;
  company_name: string | null;
  stock_ticker: string | null;
  stock_price: number | null;
  volume_price: number | null;
  volume_quantity: number | null;
  exchange: string | null,
  updated: string | null;
};
export type FKCompany = {
  fk_company_currency_id: string;
};

export type Currency = {
  currency_id: string;
  currency_symbol: string;
};

export type Tag = {
  tag_id: number;
  tag_hex: string;
  tag_label: string | null;
};

export type Profile = {
  sector: string | null; 
  presence: string | null;
  investors_url: string | null;
  profile_description: string | null;
};
export type FKProfile = {
  fk_profile_company_id: number;
};

export type FilterationStep = {
  step_id: string; 
  caption: string | null;
};

export type Filteration = {
  notes: string | null;
};
export type FKFilteration = {
  fk_filteration_step_id: string;
  fk_filteration_company_id: string;
  fk_filteration_tag_id: number;
};

export type MacroSector = {
  sector_id: string;
  sector_name: string | null;
};

export type MacroAnalysis = {
  notes: string | null;
};
export type FKMacroAnalysis = {
  fk_macro_analysis_sector_id: string;
};
