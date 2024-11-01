import { Tab } from "./tabs";


export type ContentDirection = "horizontal" | "vertical";

export type SplitSide = "left" | "right";

export interface SplitTreeItem {
  isFork: boolean;
  side: SplitSide | null;
}

export type SplitTreeNode = SplitTreeFork | SplitTreeValue;

export type DividerSettings = {
  direction: ContentDirection;
  value: number;
};

export interface SplitTreeFork extends SplitTreeItem {
  divider: DividerSettings;
  left: SplitTreeNode;
  right?: SplitTreeNode | null;
}

export interface SplitTreeValue extends SplitTreeItem {
  value: Tab[];
}

export type SplitTree = {
  root: SplitTreeNode;
};

export function addTab(targetFork: SplitTreeFork, targetSide: SplitSide, tab: Tab): void {
  if( !targetFork[targetSide] || targetFork[targetSide].isFork ) {
    return;
  };
  (targetFork[targetSide] as SplitTreeValue).value.push(tab);
}

export type RemoveResult = {
  failed: boolean;
  trackedFork: SplitTreeFork | null;
};

const DEFAULT_DIVIDER_VALUE_PERCENT: number = 50;

/**
 * Removes a tab from a given fork and shifts around nodes if any value node runs out 
 * of tabs in the process. In order to track changes to a given fork, a 'pivot fork' can
 * be provided. The function will check any of the shifted nodes matches the pivot and 
 * returns the node that has now taken the place of the pivot fork (the 'tracked fork'). 
 * This is used when splitting tabs to keep track of the fork that the tab will be split
 * into (the target fork), because the target may shift when being deleted from the 
 * source fork.
 * 
 * **Notice:** this operation assumes the given forks to be a part 
 * of a valid SplitTree where there is an unchanging root fork with a single left branch,
 * and where no two value nodes share the same parent (although they may have a common 
 * ancestor). This operation does **NOT** introduce new nodes to the tree.
 * 
 * @param parentFork Fork that contains the fork where the tab is to be deleted from.
 * @param parentSide Branch in the parent that contains the fork.
 * @param targetSide Branch in the fork that contains the tabs (the value node).
 * @param targetTab Tab to be removed.
 * @param pivotFork Fork 
 * 
 * @returns 
 */
export function removeTab(
  parentFork: SplitTreeFork, 
  parentSide: SplitSide, 
  targetSide: SplitSide, 
  targetTab: Tab,
  pivotFork?: SplitTreeFork
): RemoveResult {
  const failed = (): RemoveResult => {
    return {
      failed: true,
      trackedFork: null
    };
  };

  if( !parentFork[parentSide] || !parentFork[parentSide].isFork ) {
    return failed();
  };

  const targetFork: SplitTreeFork = parentFork[parentSide] as SplitTreeFork;
  const targetNode: SplitTreeNode | null | undefined = targetFork[targetSide];
  if( !targetNode || targetNode.isFork ) {
    return failed();
  }

  const targetTabs: Tab[] = (targetNode as SplitTreeValue).value;
  const targetTabIndex: number = targetTabs.indexOf(targetTab);
  if( targetTabIndex < 0 ) {
    return failed();
  }

  let trackedFork: SplitTreeFork | undefined = pivotFork;
  targetTabs.splice(targetTabIndex, 1);

    // Consume split tree nodes
  if( targetTabs.length === 0 ) {
      // Consuming a fork leads to its nodes being copied to its parent fork.
      // Sometimes the consumed fork is the also the target fork -> update the
      // tracked fork
    if( pivotFork && (parentFork.left === pivotFork || parentFork.right === pivotFork) ) {
      trackedFork = parentFork;
    }
    
    if( parentSide === "right" ) {
      parentFork.left = (parentFork.left as SplitTreeFork).left;
      parentFork.right = (parentFork.left as SplitTreeFork).right;
    } else if( parentFork.right ) {
      parentFork.left = (parentFork.right as SplitTreeFork).left;
      parentFork.right = (parentFork.right as SplitTreeFork).right;
    }
  }
  
  return {
    failed: false,
    trackedFork: trackedFork ?? null
  };
}

export function splitTab(
  targetFork: SplitTreeFork,
  requestedSide: SplitSide,
  requestedDirection: ContentDirection,
  tab: Tab
): void {
  if( targetFork[requestedSide] ) {
    targetFork[(requestedSide === "left") ? "right" : "left"] = targetFork[requestedSide];
  }

  targetFork[requestedSide] = {
    isFork: false,
    side: requestedSide,
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
    side: "left",
    //direction: "horizontal",
    divider: {
      direction: "horizontal",
      value: DEFAULT_DIVIDER_VALUE_PERCENT
    },
    left: {
      ...targetFork.left
    }
  };

  targetFork.right = {
    isFork: true,
    side: "right",
    //direction: "horizontal",
    divider: {
      direction: "horizontal",
      value: DEFAULT_DIVIDER_VALUE_PERCENT
    },
    left: {
      ...targetFork.right!
    }
  };
}
