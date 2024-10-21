import TabbedView, { Tab } from "@renderer/components/TabbedView/TabbedView";
import AnalysisModule from "@renderer/modules/AnalysisModule/AnalysisModule";
import CompaniesModule from "@renderer/modules/Companies/CompaniesModule";
import MacroModule from "@renderer/modules/MacroModule/MacroModule";
import { formatID, ViewProps } from "@renderer/views";

interface WorkspaceViewProps extends ViewProps {}

export default function WorkspaceView(props: WorkspaceViewProps): JSX.Element {
  const pParentID: string = props.parentID;
  return (
    <div className="w-100 h-100">
      <TabbedView
      key={"wstabs-"+pParentID}
        height={24}
        tabs={[
          Tab(formatID(pParentID, "companies"), "Companies", CompaniesModule),
          Tab(formatID(pParentID, "analysis"), "Analysis", AnalysisModule),
          Tab(formatID(pParentID, "macro"), "Macro", MacroModule)
        ]}
      />
    </div>
  );
}
