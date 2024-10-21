import TabbedView, { Tab } from "@renderer/components/TabbedView/TabbedView";
import { formatID, ViewProps } from "@renderer/views";

interface AnalysisModuleProps extends ViewProps {}

export default function AnalysisModule(props: AnalysisModuleProps) {
  const pParentID: string = props.parentID;
  return (
    <div className="w-100 h-100">
      <TabbedView
        height={24}
        tabs={[
          Tab(formatID(pParentID, "volume"), "Volume", () => <>Volume</>),
          Tab(formatID(pParentID, "price-action"), "Price action", () => <>Price action</>),
          Tab(formatID(pParentID, "technical"), "Technical", () => <>Technical</>),
          Tab(formatID(pParentID, "fundamental"), "Fundamental", () => <>Fundamental</>)
        ]}
      />
    </div>
  );
}
