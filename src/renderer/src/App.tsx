import { ReactNode, useContext } from "react";
import { GlobalContext } from "./context/GlobalContext";
import TabbedView from "./components/TabbedView/TabbedView";

export default function App(): ReactNode {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const context = useContext(GlobalContext);
  /*const viewRef: React.MutableRefObject<Tab> = useRef({
    id: "",
    
  });*/
  //const [testSelection, setTextSelection] = useState<TabbedViewTab | null>(context.views.selection);



  return (
    <GlobalContext.Provider value={{ viewRef: null }}>
      <div className="w-100 h-100 overflow-hidden">
        <TabbedView view={{ 
            id: "view-test", 
            workspace: "test-workspace",
            caption: "Test tab", 
            tabs: [
              {
                id: "test", 
                workspace: "test-workspace",
                caption: "subtab", 
                tabs: [{
                  id: "testtestset",
                  workspace: "test-workspace",
                  caption: "yet another subtab",
                  tabs: [],
                  content: {
                    direction: "horizontal",
                    main: "macro",
                  },
                  activeTab: null,
                  isMinimized: false
                }], 
                content: {
                  direction: "horizontal",
                  main: null
                }, 
                activeTab: null, 
                isMinimized: true
              },
              {
                id: "another", 
                workspace: "test-workspace",
                caption: "another one", 
                tabs: [], 
                content: {
                  direction: "vertical",
                  main: "analysis",
                  alternate: "filteration"
                }, 
                activeTab: null, 
                isMinimized: true
              }
            ], 
            content: {
              direction: "horizontal",
              main: null
            },
            activeTab: null, 
            isMinimized: true 
          }} 
          tabHeight={24} 
        />
      </div>
    </GlobalContext.Provider>
  );
}
