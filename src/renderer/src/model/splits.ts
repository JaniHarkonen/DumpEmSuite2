import { Tab } from "./tabs";
import { ContentDirection } from "./view";


export type SplitSide = "left" | "right";

export interface SplitTreeItem {
  isFork: boolean;
  side: SplitSide | null;
}

export type SplitTreeNode = SplitTreeFork | SplitTreeValue;

export interface SplitTreeFork extends SplitTreeItem {
  direction: ContentDirection;
  left: SplitTreeNode;
  right?: SplitTreeNode | null;
}

export interface SplitTreeValue extends SplitTreeItem {
  value: Tab[];
}

export type SplitTree = {
  root: SplitTreeNode;
};
