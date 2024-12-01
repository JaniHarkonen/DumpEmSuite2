import CompanyAnalysisList from "@renderer/components/CompanyAnalysisList/CompanyAnalysisList";
import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import TagPanel from "@renderer/components/TagPanel/TagPanel";
import { TabInfoContext } from "@renderer/context/TabInfoContext";
import { useContext } from "react";


export default function FilterationView() {
  const {currentTab} = useContext(TabInfoContext);


  return (
    <PageContainer>
      <PageHeader>{currentTab?.caption}</PageHeader>
      <TagPanel />
      <CompanyAnalysisList />
    </PageContainer>
  );
}
