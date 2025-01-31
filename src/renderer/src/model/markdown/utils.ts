import { ASTNode } from "./parser";

export function fixMarkdown(
  markdown: string, value: (string | number | boolean)[], dataNode: ASTNode[] | undefined
): string {
  let updatedMarkdown: string = markdown;
  
  if( !dataNode ) {
    return updatedMarkdown;
  }

  for( let i = dataNode.length - 1; i >= 0; i-- ) {
    const contentStart: number = dataNode[i].contentPositionStart ?? -1;
    const contentEnd: number = dataNode[i].contentPositionEnd ?? -1;

    if( contentStart < 0 || contentEnd < 0 ) {
      continue;
    }

    updatedMarkdown = (
      updatedMarkdown.substring(0, contentStart) + 
      value[i] + 
      updatedMarkdown.substring(contentEnd)
    );
  }

  return updatedMarkdown;
}