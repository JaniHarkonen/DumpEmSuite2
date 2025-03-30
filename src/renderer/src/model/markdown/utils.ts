import { ASTNode } from "./parser";


type NodeValue = string | number | boolean;

export function fixMarkdown(
  markdown: string, value: NodeValue[], dataNode: ASTNode[] | undefined
): string {
  let updatedMarkdown: string = markdown;
  
  if( !dataNode ) {
    return updatedMarkdown;
  }

    // Match every value with the ASTNode representing the element the value is meant for
  const nodeToValue: Map<ASTNode, NodeValue> = new Map<ASTNode, NodeValue>();
  for( let i = 0; i < dataNode.length; i++ ) {
    nodeToValue.set(dataNode[i], value[i]);
  }

    // Sort all ASTNodes such that the nodes are in the order that they appear in the markdown.
    // This will ensure that the markdown string can be fixed from the last element to the 
    // first, ensuring that the 'contentPositionStart' and 'contentPositionEnd' properties are 
    // always correct. Because this operation may change the order of the ASTNodes, the order 
    // might become out of synch with the order of the 'values', hence the 'nodeToValue' map.
  const fixedDataNode: ASTNode[] = [...dataNode].sort((a: ASTNode, b: ASTNode) => {
    return (a.contentPositionStart ?? -1) - (b.contentPositionStart ?? -1);
  });

  for( let i = fixedDataNode.length - 1; i >= 0; i-- ) {
    const contentStart: number = fixedDataNode[i].contentPositionStart ?? -1;
    const contentEnd: number = fixedDataNode[i].contentPositionEnd ?? -1;

    if( contentStart < 0 || contentEnd < 0 ) {
      continue;
    }

    updatedMarkdown = (
      updatedMarkdown.substring(0, contentStart) + 
      nodeToValue.get(fixedDataNode[i]) +
      updatedMarkdown.substring(contentEnd)
    );
  }

  return updatedMarkdown;
}
