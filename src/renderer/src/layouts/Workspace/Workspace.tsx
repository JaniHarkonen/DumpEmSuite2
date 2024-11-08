import SplitView from "@renderer/components/SplitView/SplitView";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import CompaniesModule from "../modules/CompaniesModule/CompaniesModule";
import AnalysisModule from "../modules/AnalysisModule/AnalysisModule";
import useSplitTreeManager from "@renderer/hook/useSplitTreeManager";


const testContentProvider: TabContentProvider = {
  getContent: (contentTemplate: string) => {  
    switch(contentTemplate) {
      case "template1": return <CompaniesModule />;
      case "template2": return <AnalysisModule />;
      case "template3": return <>temp3</>;
      case "template4": return <>t4 works as well</>;
      case "template5": return <>final template works too</>;
    }
    return <>FAILED</>;
  }
};

type Props = {
  sceneBlueprint: SplitTreeBlueprint | null;
}

export default function Workspace(props: Props) {
  const pSceneBlueprint: SplitTreeBlueprint | null = props.sceneBlueprint;

  const [splitTree] = useSplitTreeManager({
    sceneBlueprint: pSceneBlueprint,
    contentProvider: testContentProvider
  });

  
  return (
    <>
      {splitTree && <SplitView splitTree={splitTree} />}
    </>
  );
}
