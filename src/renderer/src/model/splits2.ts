import { buildTab, TabContentProvider, Tab, TabBlueprint, blueprintTab } from "./tabs";

  //////////////////// DIVIDER ///////////////////////
export const DEFAULT_DIVIDER_VALUE_PERCENT: number = 50;
type DividerDirection = "horizontal" | "vertical";
type SplitBranch = "left" | "right";

type DividerSettings = {
  direction: DividerDirection;
  value: number;
};

  //////////////////// BLUEPRINTS ///////////////////////
type SplitTreeNodeBlueprint = SplitTreeValueBlueprint | SplitTreeForkBlueprint;

interface SplitTreeItemBlueprint {
  isFork: boolean;
}

interface SplitTreeValueBlueprint extends SplitTreeItemBlueprint {
  value: TabBlueprint[];
}

interface SplitTreeForkBlueprint extends SplitTreeItemBlueprint {
  divider: DividerSettings;
  left: SplitTreeNodeBlueprint;
  right?: SplitTreeNodeBlueprint;
}

export type SplitTreeBlueprint = {
  root: SplitTreeForkBlueprint;
}

  //////////////////// BUILT ///////////////////////
type SplitTreeNode = SplitTreeValue | SplitTreeFork;
interface SplitTreeItem<T> {
  isFork: boolean;
  parent: SplitTreeFork | null;
  liveNode?: T;
}

interface SplitTreeValue extends SplitTreeItem<SplitTreeValue> {
  value: Tab[];
  parent: SplitTreeFork | null;
}

interface SplitTreeFork extends SplitTreeItem<SplitTreeFork> {
  divider: DividerSettings;
  left: SplitTreeNode;
  right?: SplitTreeNode;
}

export type SplitTree = {
  root: SplitTreeFork;
};

type LiveNodeOperation = (liveNodes: SplitTreeNode[]) => boolean;

export class SplitTreeManager {
  static buildTree(
    treeBlueprint: SplitTreeBlueprint, contentProvider: TabContentProvider
  ): SplitTree | null {
    if( !treeBlueprint.root.isFork ) {
      return null;
    }

    const buildNode = (
      nodeBlueprint: SplitTreeNodeBlueprint | null | undefined,
      parent: SplitTreeFork | null = null
    ): SplitTreeNode | null | undefined => {
      if( !nodeBlueprint ) {  // Handle undefined
        return nodeBlueprint;
      } else if( nodeBlueprint.isFork ) { // Handle forks
        const fork: SplitTreeForkBlueprint = nodeBlueprint as SplitTreeForkBlueprint;
        const result: SplitTreeFork = {
          isFork: true,
          divider: {...fork.divider},
          parent
        } as SplitTreeFork;
        return {
          ...result,
          left: buildNode(fork.left, result)!,
          right: buildNode(fork.right, result) ?? undefined
        };
      } else {  // Handle value nodes
        return {
          isFork: false,
          parent,
          value: (nodeBlueprint as SplitTreeValueBlueprint).value.map(
            (tabBlueprint: TabBlueprint) => buildTab(tabBlueprint, contentProvider)
          )
        };
      }
    };

    return {
      root: buildNode(treeBlueprint.root) as SplitTreeFork
    };
  }


  private tree: SplitTree;

  constructor(tree: SplitTree) {
    this.tree = tree;
  }


  public snapshot(): SplitTree {
    const snapshotNode = (
      node: SplitTreeNode | null | undefined,
      parent: SplitTreeFork | null = null,
    ): SplitTreeNode | null | undefined => {
      if( !node ) {
        return node;
      } else if( node.isFork ) {
        const fork: SplitTreeFork = node as SplitTreeFork;
        const result: SplitTreeFork = {
          ...fork,
          divider: {...fork.divider}
        };
        return {
          ...result,
          parent,
          liveNode: fork,
          left: snapshotNode(fork.left, result)!,
          right: snapshotNode(fork.right, result) ?? undefined
        };
      } else {
        const valueNode: SplitTreeValue = node as SplitTreeValue;
        return {
          isFork: false,
          parent,
          liveNode: valueNode,
          value: [...valueNode.value]
        };
      }
    };

    return {
      root: snapshotNode(this.tree.root) as SplitTreeFork
    };
  }

  public blueprint(): SplitTreeBlueprint {
    const blueprintNode = (
      node: SplitTreeNode | null | undefined
    ): SplitTreeNodeBlueprint | null | undefined => {
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
          value: valueNode.value.map((tab: Tab) => blueprintTab(tab))
        };
      }
    };

    return {
      root: blueprintNode(this.snapshot().root) as SplitTreeForkBlueprint
    };
  }

  private getLiveNodeAnd(operation: LiveNodeOperation, ...targetNode: SplitTreeNode[]): boolean {
    const liveNodes: SplitTreeNode[] = [];
    for( let i = 0; i < targetNode.length; i++ ) {
      const live: SplitTreeNode | undefined = targetNode[i].liveNode;
      if( !live ) {
        return false;
      }
      liveNodes.push(live);
    }
    return operation(liveNodes);
  }

  private setChild(parent: SplitTreeFork, branch: SplitBranch, child: SplitTreeNode | undefined): void {
    if( child ) {
      parent[branch] = child;
      child.parent = parent;
    } else if( branch === "right" ) {
      parent.right = undefined;
    }
  }

  public addTab(targetNode: SplitTreeValue, tab: Tab): boolean {
    return this.getLiveNodeAnd((liveNodes: SplitTreeNode[]) => {
      const [liveNode] = liveNodes;
      (liveNode as SplitTreeValue).value.push(tab);
      return true;
    }, targetNode);
  }

  public removeTab(targetNode: SplitTreeValue, remove: Tab): boolean {
    return this.getLiveNodeAnd((liveNodes: SplitTreeNode[]) => {
        // Find tab index, and remove from target
      const [liveNode] = liveNodes;
      const resolvedTargetNode: SplitTreeValue = liveNode as SplitTreeValue;
      const targetTabs: Tab[] = resolvedTargetNode.value;
      const tabIndex: number = targetTabs.indexOf(remove);
      if( tabIndex < 0 ) {
        return false;
      }
      targetTabs.splice(tabIndex);

        // Rearrange the tree, if the tabs were depleted after removal
      if( targetTabs.length === 0 ) {
        const targetFork: SplitTreeFork = resolvedTargetNode.parent!;
        const targetParent: SplitTreeFork = targetFork.parent!;
        const branch: SplitBranch = (targetParent.left === targetFork) ? "left" : "right";

        if( branch === "right" ) {
          const parentLeft: SplitTreeFork = (targetParent.left as SplitTreeFork);
          this.setChild(targetParent, "right", parentLeft.right);
          this.setChild(targetParent, "left", parentLeft.left);
        } else if( targetParent.right ) {
          const parentRight: SplitTreeFork = (targetParent.right as SplitTreeFork);
          this.setChild(targetParent, "left", parentRight.left);
          this.setChild(targetParent, "right", parentRight.right);
        }
      }

      return true;
    }, targetNode);
  }

  public relocateTab(fromNode: SplitTreeValue, toNode: SplitTreeValue, tab: Tab): boolean {
    return this.getLiveNodeAnd((liveNodes: SplitTreeNode[]) => {
      const [liveFrom, liveTo] = liveNodes;
      return this.addTab(liveTo as SplitTreeValue, tab) && 
      this.removeTab(liveFrom as SplitTreeValue, tab);
    }, fromNode, toNode);
  }

  public splitTab(
    fromNode: SplitTreeValue, 
    toFork: SplitTreeFork, 
    requestedDirection: DividerDirection, 
    requestedBranch: SplitBranch,
    tab: Tab
  ): boolean {
    return this.getLiveNodeAnd((liveNodes: SplitTreeNode[]) => {
      const [liveFrom, liveTo] = liveNodes;
      const attemptRemove: boolean = this.removeTab(liveFrom as SplitTreeValue, tab);
      if( !attemptRemove ) {
        return false;
      }

      const targetFork: SplitTreeFork = liveTo as SplitTreeFork;
      if( targetFork[requestedBranch] ) {
        targetFork[(requestedBranch === "left") ? "right" : "left"] = targetFork[requestedBranch];
      }
    
      targetFork[requestedBranch] = {
        isFork: false,
        parent: targetFork,
        value: [tab]
      };

      targetFork.divider = {
        direction: requestedDirection,
        value: DEFAULT_DIVIDER_VALUE_PERCENT
      };
    
        // Ensure that there is only one set of tabs per fork, split fork when left and right are full
        // (not null)
      targetFork.left = {
        isFork: true,
        divider: {
          direction: "horizontal",
          value: DEFAULT_DIVIDER_VALUE_PERCENT
        },
        parent: targetFork,
        left: targetFork.left
      };
      targetFork.right = {
        isFork: true,
        divider: {
          direction: "horizontal",
          value: DEFAULT_DIVIDER_VALUE_PERCENT
        },
        parent: targetFork,
        left: targetFork.right!
      };

      return true;
    }, fromNode, toFork);
  }
}
