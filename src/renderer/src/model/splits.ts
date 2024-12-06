import { buildTab, TabContentProvider, Tab, TabBlueprint, blueprintTab, TabSettingsBlueprint, TabSettings, copyTab, indexOfTab } from "./tabs";

  //////////////////// DIVIDER ///////////////////////
export const DEFAULT_DIVIDER_VALUE_PERCENT: number = 50;
export type DividerDirection = "horizontal" | "vertical";
export type SplitBranch = "left" | "right";

export type DividerSettings = {
  direction: DividerDirection;
  value: number;
};

  //////////////////// BLUEPRINTS ///////////////////////
type SplitTreeNodeBlueprint = SplitTreeValueBlueprint | SplitTreeForkBlueprint;

type SplitTreeItemBlueprint = {
  isFork: boolean;
}

export type SplitTreeValueBlueprint = {
  value: TabSettingsBlueprint;
} & SplitTreeItemBlueprint;

export type SplitTreeForkBlueprint = {
  divider: DividerSettings;
  left: SplitTreeNodeBlueprint;
  right?: SplitTreeNodeBlueprint;
} & SplitTreeItemBlueprint;

export type SplitTreeBlueprint = {
  root: SplitTreeForkBlueprint;
}

  //////////////////// BUILT ///////////////////////
export type SplitTreeNode = SplitTreeValue | SplitTreeFork;
interface SplitTreeItem<T> {
  isFork: boolean;
  parent: SplitTreeFork | null;
  liveNode?: T;
}

export interface SplitTreeValue extends SplitTreeItem<SplitTreeValue> {
  value: TabSettings;
  parent: SplitTreeFork | null;
}

export interface SplitTreeFork extends SplitTreeItem<SplitTreeFork> {
  divider: DividerSettings;
  left: SplitTreeNode;
  right?: SplitTreeNode;
}

export type SplitTree = {
  root: SplitTreeFork;
};

type LiveNodeOperation<T> = (liveNodes: SplitTreeNode[] | null) => T;

type RemoveResult = {
  wasSuccessful: boolean;
  trackedFork: SplitTreeFork | null;
};

export function defaultSplitTreeBlueprint(): SplitTreeBlueprint {
  return {
    root: {
      isFork: true,
      divider: {
        direction: "horizontal",
        value: 50
      },
      left: {
        isFork: false,
        value: {
          tabs: [],
          activeTabIndex: -1
        }
      }
    }
  };
}

export function snapshotNode (
  node: SplitTreeNode | null | undefined,
  parent: SplitTreeFork | null = null,
): SplitTreeNode | null | undefined {
  if( !node ) {
    return node;
  } else if( node.isFork ) {
    const fork: SplitTreeFork = node as SplitTreeFork;
    const result: SplitTreeFork = {
      isFork: true,
      divider: {...fork.divider},
      parent,
      liveNode: fork
    } as SplitTreeFork;

    result.left = snapshotNode(fork.left, result)!;
    result.right = snapshotNode(fork.right, result) ?? undefined;

    return result;
  } else {
    const valueNode: SplitTreeValue = node as SplitTreeValue;

    return {
      isFork: false,
      parent,
      liveNode: valueNode,
      value: {
        tabs: valueNode.value.tabs.map((tab: Tab) => copyTab(tab)),
        activeTabIndex: valueNode.value.activeTabIndex
      }
    };
  }
}

export function buildNode(
  nodeBlueprint: SplitTreeNodeBlueprint | null | undefined,
  contentProvider: TabContentProvider,
  parent: SplitTreeFork | null = null
): SplitTreeNode | null | undefined {
  if( !nodeBlueprint ) {  // Handle undefined
    return nodeBlueprint;
  } else if( nodeBlueprint.isFork ) { // Handle forks
    const fork: SplitTreeForkBlueprint = 
      nodeBlueprint as SplitTreeForkBlueprint;
    const result: SplitTreeFork = {
      isFork: true,
      divider: {...fork.divider},
      parent
    } as SplitTreeFork;
    result.left = buildNode(fork.left, contentProvider, result)!;
    result.right = buildNode(fork.right, contentProvider, result) ?? undefined;
    return result;
  } else {  // Handle value nodes
    const valueNode: SplitTreeValueBlueprint = 
      nodeBlueprint as SplitTreeValueBlueprint;
    return {
      isFork: false,
      parent,
      value: {
        tabs: valueNode.value.tabs.map((tabBlueprint: TabBlueprint) => {
          return buildTab(tabBlueprint, contentProvider);
        }),
        activeTabIndex: valueNode.value.activeTabIndex ?? -1
      }
    }
  }
}

export function blueprintNode(
  node: SplitTreeNode | null | undefined
): SplitTreeNodeBlueprint | null | undefined {
  if( !node ) {
    return node;
  } else if( node.isFork ) {
    const fork: SplitTreeFork = node as SplitTreeFork;
    return {
      isFork: true,
      divider: {...fork.divider},
      left: blueprintNode(fork.left)!,
      right: blueprintNode(fork.right) ?? undefined
    };
  } else {
    const valueNode: SplitTreeValue = node as SplitTreeValue;
    return {
      isFork: false,
      value: {
        tabs: valueNode.value.tabs.map((tab: Tab) => {
          return blueprintTab(tab);
        }),
        activeTabIndex: valueNode.value.activeTabIndex ?? -1
      }
    };
  }
};

export class SplitTreeManager {
  static buildTree(
    treeBlueprint: SplitTreeBlueprint, contentProvider: TabContentProvider
  ): SplitTree | null {
    if( !treeBlueprint.root.isFork ) {
      return null;
    }

    return {
      root: buildNode(treeBlueprint.root, contentProvider) as SplitTreeFork
    };
  }


  private tree: SplitTree;

  constructor(tree: SplitTree) {
    this.tree = tree;
  }

  public snapshot(): SplitTree {
    return {
      root: snapshotNode(this.tree.root) as SplitTreeFork
    };
  }

  public blueprint(): SplitTreeBlueprint {
    return {
      root: blueprintNode(this.tree.root) as SplitTreeForkBlueprint
    };
  }

  private getLiveNodeAnd<T>(
    operation: LiveNodeOperation<T>, ...targetNode: SplitTreeNode[]
  ): T {
    let liveNodes: SplitTreeNode[] | null = [];
    for( let i = 0; i < targetNode.length; i++ ) {
      const live: SplitTreeNode | undefined = targetNode[i].liveNode;
      if( !live ) {
        liveNodes = null;
        break;
      }
      liveNodes.push(live);
    }
    return operation(liveNodes);
  }

  private setChild(
    parent: SplitTreeFork,
    branch: SplitBranch, 
    child: SplitTreeNode | undefined
  ): void {
    if( child ) {
      parent[branch] = child;
      child.parent = parent;
    } else if( branch === "right" ) {
      parent.right = undefined;
    }
  }

  private addTabToLive(liveNode: SplitTreeValue, targetTab: Tab, index: number): void {
    const tabs: Tab[] = (liveNode as SplitTreeValue).value.tabs;

      // Figure out the first and last available indices where the tab can be added given the 
      // 'order' of each tab in the live node
    let firstAvailableIndex: number = 0;
    while( 
      firstAvailableIndex < tabs.length && tabs[firstAvailableIndex].order < targetTab.order
    ) {
      firstAvailableIndex++;
    }

    let lastAvailableIndex: number = firstAvailableIndex;
    while( 
      lastAvailableIndex < tabs.length && tabs[lastAvailableIndex].order === targetTab.order 
    ) {
      lastAvailableIndex++;
    }

    index = Math.max(firstAvailableIndex, Math.min(lastAvailableIndex, index));
    tabs.splice(index, 0, targetTab);
  }

  private reorderTabLive(liveNode: SplitTreeValue, targetTab: Tab, index: number): boolean {
    const tabs: Tab[] = liveNode.value.tabs;
    const currentIndex: number = indexOfTab(tabs, targetTab);
    index = Math.max(0, Math.min(tabs.length, index));

    if( currentIndex < 0 || currentIndex === index ) {
      return false;
    }

    tabs.splice(currentIndex, 1);
    this.addTabToLive(liveNode, targetTab, index);

    return true;
  }

  private removeTabFromLive(
    targetNode: SplitTreeValue, remove: Tab, trackedFork?: SplitTreeFork
  ): RemoveResult {
      // Find tab index, and remove from target
    const resolvedTargetNode: SplitTreeValue = targetNode;
    const targetTabs: Tab[] = resolvedTargetNode.value.tabs;
    const tabIndex: number = indexOfTab(targetTabs, remove);
    if( tabIndex < 0 ) {
      return {
        wasSuccessful: false,
        trackedFork: null
      };
    }
    targetTabs.splice(tabIndex, 1);

      // Rearrange the tree, if the tabs were depleted after removal
    if( targetTabs.length === 0 ) {
      const targetFork: SplitTreeFork = resolvedTargetNode.parent!;
      const targetParent: SplitTreeFork = targetFork.parent!;
      const branch: SplitBranch = 
        (targetParent.left === targetFork) ? "left" : "right";

      if( 
        trackedFork && 
        (targetParent.left === trackedFork || targetParent.right === trackedFork) 
      ) {
        trackedFork = targetParent;
      }

      if( branch === "right" ) {
        const parentLeft: SplitTreeFork = (targetParent.left as SplitTreeFork);
        this.setChild(targetParent, "right", parentLeft.right);
        this.setChild(targetParent, "left", parentLeft.left);
      } else if( targetParent.right ) {
        const parentRight: SplitTreeFork = (targetParent.right as SplitTreeFork);
        this.setChild(targetParent, "left", parentRight.left);
        this.setChild(targetParent, "right", parentRight.right);
      } else {
        targetParent.right = undefined;
      }
    }

    return {
      wasSuccessful: true,
      trackedFork: trackedFork ?? null
    };
  }

  public openTab(targetNode: SplitTreeValue, tabIndex: number): boolean {
    return this.getLiveNodeAnd((liveNodes: SplitTreeNode[] | null): boolean => {
      if( !liveNodes ) {
        return false;
      }

      const [targetValueNode] = liveNodes;
      const tabSettings: TabSettings = (targetValueNode as SplitTreeValue).value;
      
      if( tabIndex < 0 || tabIndex >= tabSettings.tabs.length ) {
        return false;
      }
      
      tabSettings.activeTabIndex = tabIndex;
      return true;
    }, targetNode);
  }

  public addTab(targetNode: SplitTreeValue, tab: Tab, index: number = Infinity): boolean {
    return this.getLiveNodeAnd((liveNodes: SplitTreeNode[] | null): boolean => {
      if( !liveNodes ) {
        return false;
      }

      const [liveNode] = liveNodes;
      this.addTabToLive(liveNode as SplitTreeValue, tab, index);
      return true;
    }, targetNode);
  }

  public removeTab(targetNode: SplitTreeValue, remove: Tab): RemoveResult {
    return this.getLiveNodeAnd(
      (liveNodes: SplitTreeNode[] | null): RemoveResult => {
        if( !liveNodes ) {
          return {
            wasSuccessful: false,
            trackedFork: null
          };
        }

        const [liveNode] = liveNodes;
        return this.removeTabFromLive(liveNode as SplitTreeValue, remove);
      }, targetNode
    );
  }

  public reorderTab(targetNode: SplitTreeValue, targetTab: Tab, index: number): boolean {
    return this.getLiveNodeAnd(
      (liveNodes: SplitTreeNode[] | null): boolean => {
        if( !liveNodes ) {
          return false;
        }

        const [liveNode] = liveNodes;
        return this.reorderTabLive(liveNode as SplitTreeValue, targetTab, index);
      }, targetNode
    )
  }

  public relocateTab(
    fromNode: SplitTreeValue, toNode: SplitTreeValue, tab: Tab
  ): boolean {
      // Can't relocate to the same tab
    if( fromNode === toNode ) {
      return false;
    }

    return this.getLiveNodeAnd((liveNodes: SplitTreeNode[] | null): boolean => {
      if( !liveNodes ) {
        return false;
      }

      const [liveFrom, liveTo] = liveNodes;
      this.addTabToLive(liveTo as SplitTreeValue, tab, -1);
      return this.removeTabFromLive(liveFrom as SplitTreeValue, tab).wasSuccessful;
    }, fromNode, toNode);
  }

  public splitTab(
    fromNode: SplitTreeValue, 
    toFork: SplitTreeFork, 
    requestedDirection: DividerDirection, 
    requestedBranch: SplitBranch,
    tab: Tab
  ): boolean {
    return this.getLiveNodeAnd((liveNodes: SplitTreeNode[] | null): boolean => {
      if( !liveNodes ) {
        return false;
      }

      const [liveFrom, liveTo] = liveNodes;
      const targetFork: SplitTreeFork = liveTo as SplitTreeFork;

      if( targetFork[requestedBranch] ) {
        targetFork[(requestedBranch === "left") ? "right" : "left"] = 
          targetFork[requestedBranch];
      }
    
      targetFork[requestedBranch] = {
        isFork: false,
        parent: targetFork,
        value: {
          tabs: [tab],
          activeTabIndex: -1
        }
      };

      targetFork.divider = {
        direction: requestedDirection,
        value: DEFAULT_DIVIDER_VALUE_PERCENT
      };
    
        // Ensure that there is only one set of tabs per fork, split fork when 
        // left and right are full (not null)
      targetFork.left = {
        isFork: true,
        divider: {
          direction: "horizontal",
          value: DEFAULT_DIVIDER_VALUE_PERCENT
        },
        parent: targetFork,
        left: targetFork.left
      };
      targetFork.left.left.parent = targetFork.left;
      
      targetFork.right = {
        isFork: true,
        divider: {
          direction: "horizontal",
          value: DEFAULT_DIVIDER_VALUE_PERCENT
        },
        parent: targetFork,
        left: targetFork.right!
      };
      targetFork.right.left.parent = targetFork.right;

      this.removeTabFromLive(
        liveFrom as SplitTreeValue, tab, liveTo as SplitTreeFork
      );

      return true;
    }, fromNode, toFork);
  }

  public moveDivider(targetFork: SplitTreeFork, newValue: number): boolean {
    return this.getLiveNodeAnd((liveNodes: SplitTreeNode[] | null): boolean => {
      if( !liveNodes ) {
        return false;
      }

      const [live] = liveNodes;
      (live as SplitTreeFork).divider.value = newValue;
      return true;
    }, targetFork);
  }
}
