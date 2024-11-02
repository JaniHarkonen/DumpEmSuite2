import { ReactNode } from "react";
import TabbedView from "./components/TabbedView/TabbedView";
import { SplitTree } from "./model/splits";


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
          {id: "left-side", workspace: "test", caption: "Left side", content: <>left side works</>},
          {id: "another-test", workspace: "test", caption: "Another Test", content: <>another test.... works</>},
          {id: "new-test", workspace: "test", caption: "New Test", content: <>new test works</>},
          {id: "third-test", workspace: "test", caption: "third Test", content: <>third test here</>},
          {id: "test-test", workspace: "test", caption: "TEST Test", content: <>test of tests</>},
          {id: "final-test", workspace: "test", caption: "FINAL Test", content: <>final test</>},
          {id: "last-test", workspace: "test", caption: "last Test", content: <>actual last test</>},
        ]
      }
    }
  }
};

export default function App(): ReactNode {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  return (
    <div className="w-100 h-100 overflow-hidden">
      <TabbedView tree={testSplitTree}/>
    </div>
  );
}
