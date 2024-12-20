import { ReactNode } from "react";
import { renderAST } from "./renderer";
import { tokenize } from "./tokenizer";
import { parse } from "./parser";


export function renderMarkdown(markdownString: string): ReactNode[] {
  return renderAST(parse(tokenize(markdownString)));
}
