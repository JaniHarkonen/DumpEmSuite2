import { ReactNode } from "react";
import { SplitTree } from "./model/splits";
import SplitView from "./components/SplitView/SplitView";
import {SplitTreeBlueprint, SplitTreeManager, SplitTree as st2} from "./model/splits2" ;
import { TabContentProvider } from "./model/tabs";


const testSplitTree: SplitTree = {
  root: {
    isFork: true,
    side: null,
    divider: {
      direction: "horizontal",
        value: 50
    },
    left: {
      isFork: true,
      side: null,
      divider: {
        direction: "horizontal",
        value: 50
      },
      left: {
        isFork: false,
        side: "left",
        value: [
          {id: "left-side", workspace: "test", caption: "Left side", contentTemplate: "", content: <>left side works</>},
          {id: "another-test", workspace: "test", caption: "Another Test", contentTemplate: "", content: <>another test.... works</>},
          {id: "new-test", workspace: "test", caption: "New Test", contentTemplate: "", content: <>new test works</>},
          {id: "third-test", workspace: "test", caption: "third Test", contentTemplate: "", content: <>third test here</>},
          {id: "test-test", workspace: "test", caption: "TEST Test", contentTemplate: "", content: <>test of tests</>},
          {id: "final-test", workspace: "test", caption: "FINAL Test", contentTemplate: "", content: <>final test</>},
          {id: "last-test", workspace: "test", caption: "last Test", contentTemplate: "", content: <>actual last test</>},
        ]
      }
    }
  }
};

export default function App(): ReactNode {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const testBlueprint: SplitTreeBlueprint = {
    root: {
      isFork: true,
      divider: { direction: "horizontal", value: 50 },
      left: {
        isFork: true,
        divider: {direction: "vertical", value: 33},
        left: {
          isFork: true,
          divider: {direction: "horizontal", value: 100},
          left: {
            isFork: false,
            value: [
              {id: "left-left-left", caption: "left left left", workspace: "ws", contentTemplate: "template1"},
              {id: "left-left-left2", caption: "left left left2", workspace: "ws", contentTemplate: "template2"},
              {id: "left-left-left3", caption: "left left left3", workspace: "ws", contentTemplate: "template3"},
            ]
          }
        },
        right: {
          isFork: true,
          divider: {direction: "vertical", value: 10},
          left: {
            isFork: false,
            value: [
              {id: "left-right-left", caption: "left right left", workspace: "ws", contentTemplate: "template4"},
              {id: "left-right-left2", caption: "left right left2", workspace: "ws", contentTemplate: "template5"},
            ]
          }
        }
      }
    }
  };
  const testContentProvider: TabContentProvider = {
    getContent: (contentTemplate: string) => {
      switch(contentTemplate) {
        case "template1": <>test template1 working</>; break;
        case "template2": <>template2 working</>; break;
        case "template3": <>temp3</>; break;
        case "template4": <>t4 works as well</>; break;
        case "template5": <>final template works too</>; break;
      }
      return <>FAILED</>;
    }
  }
  const testActual: st2 = SplitTreeManager.buildTree(testBlueprint, testContentProvider)!;
  const manager: SplitTreeManager =  new SplitTreeManager(testActual);

  return (
    <div className="w-100 h-100 overflow-hidden">
      <SplitView tree={testSplitTree}/>
    </div>
  );
}
