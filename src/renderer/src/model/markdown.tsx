import { ReactNode } from "react";

type MarkdownToken = {
  type: "caption" | "text",
  value: string;
};

function lex(markdownString: string): MarkdownToken[] {
  const tokens: MarkdownToken[] = [];
  let cursor: number = 0;

  const charAt = (offset: number = 0): string => {
    return markdownString.charAt(cursor + offset);
  };

  const codeAt = (offset: number = 0): number => {
    return charAt(offset).charCodeAt(0);
  };

  const token = (data: MarkdownToken) => {
    tokens.push(data);
  };

  while( cursor < markdownString.length ) {
    let current: string = charAt();
    let code: number = current.charCodeAt(0);

      // Caption
    if( current === "#" ) {
      const startIndex: number = cursor;
      let headerLevel = 2;
      while(
        cursor < markdownString.length &&
        (current = charAt()) === "#" &&
        headerLevel < 5 
      ) {
        cursor++;
        headerLevel++;
      }
      token({
        type: "caption",
        value: markdownString.substring(startIndex, cursor)
      });
    }
    
      // Plain text
    if( code >= 32 ) {
      const startIndex: number = cursor;
      while( cursor < markdownString.length && (code = codeAt()) >= 32 ) {
        cursor++;
      }
      token({
        type: "text",
        value: markdownString.substring(startIndex, cursor)
      });
    }
    cursor++;
  }

  return tokens;
}

function parse(tokens: MarkdownToken[]): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor: number = 0;
  while( cursor < tokens.length ) {
    const current: MarkdownToken = tokens[cursor];
    const next: MarkdownToken | undefined = tokens[cursor + 1];

    if( current.type === "caption" && next ) {
      switch( current.value.length ) {
        case 1: nodes.push(<h3>{next.value}</h3>); break;
        case 2: nodes.push(<h4>{next.value}</h4>); break;
        case 3: nodes.push(<h5>{next.value}</h5>); break;
        default: nodes.push(<>failed</>); break;
      }
      cursor++;
    } else if( current.type === "text" ) {
      nodes.push(<>{current.value}</>);
    }
    cursor++;
  }

  return nodes;
}

export function markdownProcessor(markdownString: string): ReactNode[] {
  return parse(lex(markdownString));
}
