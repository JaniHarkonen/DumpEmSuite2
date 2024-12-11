import WorkspaceCompaniesList from "@renderer/components/WorkspaceCompaniesList/WorkspaceCompaniesList";
import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";


export default function ListingsView() {
  return (
    <PageContainer>
      <PageHeader>Company listings</PageHeader>
      <WorkspaceCompaniesList />
    </PageContainer>
  );
}
