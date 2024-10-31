import TabbedView, { Tab } from "@renderer/components/TabbedView/TabbedView";
import { formatID, ViewProps } from "@renderer/views";

interface CompaniesModuleProps extends ViewProps {}

export default function CompaniesModule(props: CompaniesModuleProps) {
  const pParentID: string = props.parentID;
  return (
    <div className="w-100 h-100">
      <TabbedView
        height={24}
        tabs={[
          Tab(formatID(pParentID, "scraper"), "scraper", () => <>Scraper</>),
          Tab(formatID(pParentID, "listings"), "listings", () => <>Listings</>),
          Tab(formatID(pParentID, "profiles"), "profiles", () => <>Profiles</>)
        ]}
      />
    </div>
  );
}
