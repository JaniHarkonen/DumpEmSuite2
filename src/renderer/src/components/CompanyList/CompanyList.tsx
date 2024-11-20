import { CompanyStock } from "@renderer/model/companies";


type Props = {
  stocks: CompanyStock[];
};

export default function CompanyList(props: Props) {
  const pStocks: CompanyStock[] = props.stocks;

  return (
    <table className="text-align-left w-100">
      <thead>
        <tr>
          <th>Name</th>
          <th>Ticker</th>
          <th>Volume quant.</th>
          <th>Volume</th>
          <th>Share price</th>
          <th>Scraped</th>
        </tr>
      </thead>
      <tbody>
        {pStocks.map((stock: CompanyStock) => {
          return (
            <tr>
              <td><span><input type="checkbox" /></span>{stock.companyName}</td>
              <td>{stock.stockTicker}</td>
              <td>{stock.volume.quantity}</td>
              <td>{stock.volume.priceTotal}</td>
              <td>{stock.stockPrice.price}</td>
              <td>{stock.scraper.dateScraped}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
