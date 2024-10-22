import AdjustableGrid from "@renderer/components/AdjustableGrid/AdjustableGrid";
import TabbedView, { Tab, TabbedViewTab } from "@renderer/components/TabbedView/TabbedView";
import { GlobalContext } from "@renderer/context/GlobalContext";
import AnalysisModule from "@renderer/modules/AnalysisModule/AnalysisModule";
import CompaniesModule from "@renderer/modules/Companies/CompaniesModule";
import MacroModule from "@renderer/modules/MacroModule/MacroModule";
import { formatID, ViewProps } from "@renderer/views";
import { useContext, useState } from "react";

interface WorkspaceViewProps extends ViewProps {}

export default function WorkspaceView(props: WorkspaceViewProps): JSX.Element {
  const pParentID: string = props.parentID;

  const {views} = useContext(GlobalContext);
  const [testTabs, setTestTabs] = useState<TabbedViewTab[]>([]);

  const testOnTabDrop = (tab: TabbedViewTab) => {
    setTestTabs(testTabs.concat(tab));
    views.setSelection(null);
  };

  return (
    <div className="w-100 h-100">
      <AdjustableGrid>
        <TabbedView
          key={"wstabs-"+pParentID}
          height={24}
          tabs={[
            Tab(formatID(pParentID, "companies"), "Companies", CompaniesModule),
            Tab(formatID(pParentID, "analysis"), "Analysis", AnalysisModule),
            Tab(formatID(pParentID, "macro"), "Macro", MacroModule)
          ]}
        />
        <TabbedView
          key={"wstabs-"+pParentID+"-horizontal"}
          height={24}
          tabs={testTabs}
          onTabDrop={testOnTabDrop}
        />
      </AdjustableGrid>
    </div>
  );
}
