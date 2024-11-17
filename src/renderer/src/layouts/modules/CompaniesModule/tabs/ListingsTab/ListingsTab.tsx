import CompanyList from "@renderer/components/CompanyList/CompanyList";
import PageContainer from "@renderer/components/PageContainer/PageContainer";


export default function ListingsTab() {
  return (
    <PageContainer>
      <CompanyList
        stocks={[
          {
            companyName: "Bob's business",
            stockTicker: "BOB",
            volume: {
              priceTotal: 123456,
              quantity: 100
            },
            stockPrice: {
              price: 1234.56,
              currency: "EUR"
            },
            scraper: {
              dateScraped: "01-01-1000"
            }
          }
        ]}
      />
    </PageContainer>
  );
}
