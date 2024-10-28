import { Section, SectionPlacement, Tab, TabSections } from "./view";

export type TabUpdater = (newTabs: Tab[]) => void;
export type SectionsUpdater = (newSections: TabSections) => void;

type TabSelection = {
  sourceTabs: Tab[];
  tabIndex: number;
  sourceUpdater: TabUpdater;
} | null;

export default class TabManager {
  private tabSelection: TabSelection;
  private rootTab: Tab;

  constructor(rootTab: Tab) {
    this.rootTab = rootTab;
    this.tabSelection = null;
  }

  private spliceTab(tabs: Tab[], tabIndex: number) {
    tabs.splice(tabIndex, 1);
  }

  private pushTab(tabs: Tab[], tab: Tab) {
    tabs.push(tab);
  }

  public selectTab(sourceTabs: Tab[], selectedTabIndex: number, sourceUpdater: TabUpdater): void {
    this.tabSelection = {
      sourceTabs,
      tabIndex: selectedTabIndex,
      sourceUpdater
    };
  }

  public mergeTabs(targetTabs: Tab[], targetUpdater: TabUpdater): void {
    if( !this.tabSelection ) return;

    const {tabIndex, sourceTabs, sourceUpdater} = this.tabSelection;
    if( sourceTabs.length === 0 ) return;

    const tab: Tab | null | undefined = sourceTabs[tabIndex];
    if( !tab ) return;
    if( targetTabs[tabIndex] === tab ) return;

    this.pushTab(targetTabs, tab);
    this.spliceTab(sourceTabs, tabIndex);

    targetUpdater([...targetTabs]);
    sourceUpdater([...sourceTabs]);

    this.resetTabSelection();
  }

  public splitTabs(targetSections: TabSections, placement: SectionPlacement, targetUpdater: SectionsUpdater): void {
    if( !this.tabSelection ) return;
    const {sourceTabs, tabIndex, sourceUpdater} = this.tabSelection;

    if( targetSections[placement] ) {
      const otherPlacement: SectionPlacement = (placement === "main") ? "alternative" : "main";
      if( targetSections[otherPlacement] ) return;

      targetSections[otherPlacement] = targetSections[placement];
    }

    targetSections[placement] = {
      hasTabs: true,
      content: [sourceTabs[tabIndex]]
    };

    this.spliceTab(sourceTabs, tabIndex);

    targetUpdater({...targetSections});
    sourceUpdater(sourceTabs);

    this.resetTabSelection();
  }

  public resetTabSelection(): void {
    this.tabSelection = null;
  }

  public getRootTab(): Tab {
    return this.rootTab;
  }
}
