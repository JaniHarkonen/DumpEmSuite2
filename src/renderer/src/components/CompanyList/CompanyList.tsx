type Props = {

};

export default function CompanyList(props: Props) {

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Ticker</th>
          <th>Volume quant.</th>
          <th>Volume (¤)</th>
          <th>Share price (¤)</th>
          <th>Scraped</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span><input type="checkbox" /></span>Company name</td>
          <td>Ticker</td>
          <td>Volume in quantity</td>
          <td>Volume in currency</td>
          <td>Share price</td>
          <td>19.9.2028</td>
        </tr>
      </tbody>
    </table>
  );
}
