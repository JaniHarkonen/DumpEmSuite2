import { AppVersion } from "@renderer/app.config"
import { ReactNode } from "react";

export type AppViewTemplate = 
  "workspace" |
  "companies" |
  "analysis" |
  "macro" |
  "scraper" |
  "listings" |
  "profiles" |
  "filteration" |
  "fundamental" |
  "sector" |
  "notes" |
  "chart" |
  "materials"
;

type Constructor = () => ReactNode;

type AppViews = {
  [key in AppViewTemplate]: Constructor;
};

type ViewsConfig = {
  [key in AppVersion]: AppViews;
};

const APP_VIEWS: ViewsConfig = {
  "v1.0.0": {
    workspace: (): ReactNode => <>workspace</>,
    companies: (): ReactNode => <>companies</>,
    analysis: (): ReactNode => <>analysis</>,
    macro: (): ReactNode => <>macro</>,
    scraper: (): ReactNode => <>scraper</>,
    listings: (): ReactNode => <>listings</>,
    profiles: (): ReactNode => <>profiles</>,
    filteration: (): ReactNode => <>filteration</>,
    fundamental: (): ReactNode => <>fundamental</>,
    sector: (): ReactNode => <>sector</>,
    notes: (): ReactNode => <>notes</>,
    chart: (): ReactNode => <>chart</>,
    materials: (): ReactNode => <>materials</>
  }
};

export function getView(
  version: AppVersion, viewTemplate: AppViewTemplate | null, key: string
): ReactNode {
  if( !viewTemplate ) {
    return null;
  }
  const View: Constructor = APP_VIEWS[version][viewTemplate];
  return <View key={key} />;
}
