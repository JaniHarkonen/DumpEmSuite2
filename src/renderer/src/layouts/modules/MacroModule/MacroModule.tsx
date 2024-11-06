import { SplitTree, SplitTreeBlueprint, SplitTreeManager } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";

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
          {id: "view-volume", caption: "Volume", workspace: "ws-test", contentTemplate: "template1"},
          {id: "view-price-action", caption: "Price action", workspace: "ws-test", contentTemplate: "template2"},
          {id: "view-technical", caption: "Technical", workspace: "ws-test", contentTemplate: "template3"},
          {id: "view-fundamental", caption: "Fundamental", workspace: "ws-test", contentTemplate: "template4"}
        ]
      }
    }
  }
};
const testContentProvider: TabContentProvider = {
  getContent: (contentTemplate: string) => {  
    switch(contentTemplate) {
      case "template1": return <>test1</>;
      case "template2": return <>template2 working</>;
      case "template3": return <>temp3</>;
      case "template4": return <>t4 works as well</>;
      case "template5": return <>final template works too</>;
    }
    return <>FAILED</>;
  }
};
const testTreeBuilt: SplitTree = SplitTreeManager.buildTree(testBlueprint, testContentProvider)!;

export default function MacroModule() {

}
