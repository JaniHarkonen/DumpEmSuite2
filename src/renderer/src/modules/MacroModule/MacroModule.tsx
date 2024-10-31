import TabbedView, { Tab } from "@renderer/components/TabbedView/TabbedView";
import { formatID, ViewProps } from "@renderer/views";

interface MacroModuleProps extends ViewProps {}

export default function MacroModule(props: MacroModuleProps) {
  const pParentID: string = props.parentID;
  return (
    <div className="w-100 h-100">
      <TabbedView
        height={24}
        tabs={[
          Tab(formatID(pParentID, "sector-165198"), "Sector test",() => <>Sector test</>)
        ]}
      />
    </div>
  );
}
