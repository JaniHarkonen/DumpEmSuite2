import SplitView from "@renderer/components/SplitView/SplitView";
import { SplitTree, SplitTreeBlueprint, SplitTreeManager } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import CompaniesModule from "../modules/CompaniesModule/CompaniesModule";
import AnalysisModule from "../modules/AnalysisModule/AnalysisModule";


const testBlueprint: SplitTreeBlueprint = {
  root: {
    isFork: true,
    divider: { direction: "horizontal", value: 50 },
    left: {
      isFork: true,
      divider: { direction: "horizontal", value: 50 },
      left: {
        isFork: false,
        value: [
          {id: "module-companies", caption: "Companies", workspace: "ws-test", contentTemplate: "template1"},
          {id: "module-analysis", caption: "Analysis", workspace: "ws-test", contentTemplate: "template2"},
          {id: "module-macro", caption: "Macro", workspace: "ws-test", contentTemplate: "template3"},
        ]
      }
    }
  }
};
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
const testTreeBuilt: SplitTree = SplitTreeManager.buildTree(testBlueprint, testContentProvider)!;

export default function Workspace() {
  return (
    <SplitView splitTree={testTreeBuilt} />
  );
}
