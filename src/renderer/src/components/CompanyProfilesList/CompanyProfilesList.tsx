import { ReactNode } from "react";
import TableList, { OnItemFocus } from "../TableList/TableList";
import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import useWorkspaceComapanies, { CompanyWithCurrency } from "@renderer/hook/useWorkspaceCompanies";


type Props = {
  onCompanySelect?: OnItemFocus<CompanyWithCurrency>;
};

export default function CompanyProfilesList(props: Props): ReactNode {
  const {companies} = useWorkspaceComapanies();

  return (
    <PageContainer>
      <PageHeader>Companies</PageHeader>
      <TableList<CompanyWithCurrency>
        onItemFocus={props.onCompanySelect}
        columns={[
          { accessor: "company_name", caption: "Name" },
          { accessor: "stock_ticker", caption: "Ticker" },
          { accessor: "updated", caption: "Updated" }
        ]}
        cells={companies.map((company: CompanyWithCurrency) => {
          return {
            id: company.company_id,
            data: company
          };
        })}
      />
    </PageContainer>
  );
}
