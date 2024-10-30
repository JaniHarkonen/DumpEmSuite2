import { ReactNode } from "react";
import { GlobalContext } from "./context/GlobalContext";
//import TabbedView from "./components/TabbedView/TabbedView";
import { Tab } from "./model/view";
import TabManager from "./model/TabManager";
import useFlexibleTabs, { FlexibleTabs } from "./hook/useFlexibleTabs";
import TabbedView from "./components/TabbedView/TabbedView2";

const testTabs: Tab = { 
  id: "view-test", 
  workspace: "test-workspace",
  caption: "Test tab", 
  sections: {
    direction: "horizontal",
    main: {
      hasTabs: true,
      // parentTabID: "view-test",
      // parentTabWorkspace: "test-workspace",
      // placement: "main",
      content: [{
        id: "test", 
        workspace: "test-workspace",
        caption: "subtab",
        sections: {
          direction: "horizontal",
          main: {
            hasTabs: true,
            //parentTabID: "test-workspace",
            //parentTabWorkspace: "test-workspace",
            //placement: "main",
            content: [{
              id: "testtestset",
              workspace: "test-workspace",
              caption: "yet another subtab",
              sections: {
                direction: "horizontal",
                main: {
                  hasTabs: false,
                  //parentTabID: "testtesttset",
                  //parentTabWorkspace: "test-workspace",
                  //placement: "main",
                  content: "macro"
                }
              },
              activeTab: null,
              isMinimized: false
            }]
          }
        }, 
        activeTab: null, 
        isMinimized: true
      },
      {
        id: "another", 
        workspace: "test-workspace",
        caption: "another one", 
        sections: {
          direction: "vertical",
          main: {
            hasTabs: false,
            //parentTabID: "another",
            //parentTabWorkspace: "test-workspace",
            //placement: "main",
            content: "analysis"
          },
          alternate: {
            hasTabs: false,
            //parentTabID: "another",
            //parentTabWorkspace: "test-workspace",
            //placement: "alternative",
            content: "filteration"
          }
        }, 
        activeTab: null, 
        isMinimized: true
      }]
    }
  },
  activeTab: null, 
  isMinimized: true 
};

const testTabManager = new TabManager(testTabs);

export default function App(): ReactNode {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const flexibleTabs: FlexibleTabs = useFlexibleTabs({
    rootTab: testTabs
  });

  return (
    <GlobalContext.Provider value={{ viewRef: null, tabManager: testTabManager, flexibleTabs }}>
      <div className="w-100 h-100 overflow-hidden">
        <TabbedView/>
      </div>
    </GlobalContext.Provider>
  );
}
