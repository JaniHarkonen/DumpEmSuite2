import { defaultSplitTree, SplitTree, SplitTreeBlueprint, SplitTreeManager } from "@renderer/model/splits";
import { TabContentProvider } from "@renderer/model/tabs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";


type Props = {
  contentProvider: TabContentProvider;
  sceneBlueprint: SplitTreeBlueprint | null | undefined;
};

export type SplitTreeManagerProps = Props;

type Returns = [SplitTree | null, Dispatch<SetStateAction<SplitTree>>];

const DEFAULT_SPLIT_TREE: SplitTree = defaultSplitTree();

export default function useSplitTreeManager(props: Props): Returns {
  const pContentProvider: TabContentProvider = props.contentProvider;
  const pSceneBlueprint: SplitTreeBlueprint | null | undefined = props.sceneBlueprint;

  const [splitTree, setSplitTree] = useState<SplitTree>(DEFAULT_SPLIT_TREE);

  
  useEffect(() => {
    let tree: SplitTree | null;
    if( 
      !pSceneBlueprint || 
      !(tree = SplitTreeManager.buildTree(pSceneBlueprint!, pContentProvider)) 
    ) {
      setSplitTree(DEFAULT_SPLIT_TREE);
    } else {
      setSplitTree(tree);
    }
  }, [pSceneBlueprint]);


  return [
    splitTree,
    setSplitTree
  ];
}
