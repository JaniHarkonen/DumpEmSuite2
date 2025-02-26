import { ReactNode } from "react";
import { renderAST } from "./renderer";
import { tokenize } from "./tokenizer";
import { parse } from "./parser";


export function renderMarkdown(markdownString: string, keyPrefix: string): ReactNode[] {
  console.log(tokenize(markdownString))
  return renderAST(parse(tokenize(markdownString)), keyPrefix);
}
