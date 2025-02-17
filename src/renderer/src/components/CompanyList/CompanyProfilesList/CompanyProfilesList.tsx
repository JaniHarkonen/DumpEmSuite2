import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { ReactNode, useContext, useEffect } from "react";
import useWorkspaceComapanies from "@renderer/hook/useWorkspaceCompanies";
import TableList, { TableListColumn, TableListDataCell } from "@renderer/components/TableList/TableList";
import { Company } from "src/shared/schemaConfig";
import Container from "@renderer/components/Container/Container";
import { TabsContext } from "@renderer/context/TabsContext";
import { Tab } from "@renderer/model/tabs";
import useSortedData, { SortSettings } from "@renderer/hook/useSortedData";
import { ProfileContext } from "@renderer/context/ProfileContext";


const COLUMNS: TableListColumn<Company>[] = [
  { accessor: "company_name", caption: "Name" },
  { accessor: "stock_ticker", caption: "Ticker" },
  { accessor: "updated", caption: "Updated" }
];

type OnCompanyListingSelect = (company: Company) => void;

type Props = {
  onCompanySelect?: OnCompanyListingSelect;
};

export default function CompanyProfilesList(props: Props): ReactNode {
  const pOnCompanySelect: OnCompanyListingSelect = props.onCompanySelect || function(){ };

  const {companies, fetchAllCompanies} = useWorkspaceComapanies();
  const {company} = useContext(ProfileContext);
  
  useEffect(() => {
    fetchAllCompanies();
  }, []);

  const {tabs, activeTabIndex, setExtraInfo} = useContext(TabsContext);

  const activeTab: Tab = tabs[activeTabIndex];

  const {
    sortedData, 
    sortField, 
    sortOrder, 
    sortBy
  } = useSortedData({
    initialOrder: companies,
    fieldTypeMap: {
      company_name: "string",
      stock_ticker: "string",
      updated: "string",
    },
    sortField: activeTab?.extra?.sortField,
    sortOrder: activeTab?.extra?.sortOrder
  });

  const handleSortToggle = (column: TableListColumn<Company>) => {
    const settings: SortSettings = sortBy(column.accessor);
    setExtraInfo && setExtraInfo({
      sortField: settings.sortField,
      sortOrder: settings.sortOrder
    });
  };

  const handleCompanySelection = (dataCell: TableListDataCell<Company>) => {
    pOnCompanySelect(dataCell.data);
  };

    // Fix the stock data to be compatible with the table component
  const stockDataCells: TableListDataCell<Company>[] = 
    sortedData.map((stock: Company) => {
      return {
        id: stock.company_id,
        data: stock,
        hasHighlight: (company?.company_id === stock.company_id)
      };
    });

    // Determine which column is being sorted, and assign its sort order
  const stockDataColumns: TableListColumn<Company>[] = 
    COLUMNS.map((column: TableListColumn<Company>) => {
      return {
        ...column,
        ...(sortField === column.accessor ? { sortOrder } : {})
      };
    });

  return (
    <PageContainer>
      <PageHeader>Profiles</PageHeader>
      <div className="w-100">
        <Container>
          <TableList<Company>
            onItemFocus={handleCompanySelection}
            columns={stockDataColumns}
            cells={stockDataCells}
            onColumnSelect={handleSortToggle}
          />
        </Container>
      </div>
    </PageContainer>
  );
}
