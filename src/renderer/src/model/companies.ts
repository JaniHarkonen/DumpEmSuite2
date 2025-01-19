type CompanyShareVolume = {
  priceTotal: number | null;
  quantity: number | null;
};

type CompanyStockPrice = {
  currency: string | null;
  price: number | null;
};

type CompanyScraperInfo = {
  dateScraped: string | null;
};

export type CompanyStock = {
  companyName: string | null;
  stockTicker: string | null;
  volume: CompanyShareVolume;
  stockPrice: CompanyStockPrice;
  scraper: CompanyScraperInfo;
};
