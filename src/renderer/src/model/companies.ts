type CompanyShareVolume = {
  priceTotal: number;
  quantity: number;
};

type CompanyStockPrice = {
  currency: string;
  price: number;
};

type CompanyScraperInfo = {
  dateScraped: string;
};

export type CompanyStock = {
  companyName: string;
  stockTicker: string;
  volume: CompanyShareVolume;
  stockPrice: CompanyStockPrice;
  scraper: CompanyScraperInfo;
};