type DatabaseSchema = {
  metadata: {
    table: Metadata;
  };
  scraper: {
    table: Scraper;
  };
  company: {
    table: Company;
    fk: FKCompany;
  };
  currency: {
    table: Currency;
  };
  color_code: {
    table: ColorCode;
  };
  profile: {
    table: Profile;
    fk: FKProfile;
  };
  filteration_step: {
    table: FilterationStep;
    fk: FKFilterationStep;
  };
  filteration: {
    table: Filteration;
    fk: FKFilteration;
  };
  fundamental: {
    table: Fundamental;
    fk: FKFundamental;
  };
  macro_sector: {
    table: MacroSector;
  };
  macro_analysis: {
    table: MacroAnalysis;
    fk: FKMacroAnalysis;
  };
};

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
  updated: string | null;
};
export type FKCompany = {
  fk_company_currency_id: string;
};

export type Currency = {
  currency_id: string;
  currency_symbol: string;
};

export type ColorCode = {
  code_id: number;
  code_hex: string;
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
export type FKFilterationStep = {
  fk_previous_step_id: string | null;
};

export type Filteration = {
  notes: string | null;
};
export type FKFilteration = {
  fk_filteration_step_id: string;
  fk_filteration_company_id: string;
  fk_filteration_code_id: number;
};

export type Fundamental = {
  notes: string | null;
};
export type FKFundamental = {
  fk_fundamental_company_id: number;
  fk_fundamental_code_id: number;
};

export type MacroSector = {
  sector_id: string;
  sector_name: string | null;
};

export type MacroAnalysis = {
};
export type FKMacroAnalysis = {
  fk_macro_analysis_sector_id: string;
};
