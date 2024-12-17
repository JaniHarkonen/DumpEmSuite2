import { ReactNode } from "react";


type TextMode = "italic" | "bold";

type ListPointType = "list-main" | "list-info" | "list-conclusion" | "list-question" | 
  "list-important" | "list-pro" | "list-con";

type TokenType = TextMode | ListPointType | "header" | "text" | "line-break" | "italic-end" | "bold-end";

type MarkdownToken = {
  type: TokenType;
  value: string;
};

type ParseResult = {
  wasSuccessful: boolean;
  reactNodes: ReactNode[]
} | null;

function codeOf(char: string): number {
  return char.charCodeAt(0);
}

function lex(markdownString: string): MarkdownToken[] {
  const tokens: MarkdownToken[] = [];
  let cursor: number = -1;

  const peek = (offset: number = 1): string | undefined => {
    return markdownString.charAt(cursor + offset);
  };

  const peekCode = (offset: number = 1): number => {
    return peek(offset)?.charCodeAt(0) ?? -1;
  };

  const token = (data: MarkdownToken) => tokens.push(data);

  const advance = (amount: number = 1) => cursor += amount;

  const copy = (start: number, end: number): string => {
    return markdownString.substring(start, end);
  };

  let isItalicOpen: boolean = false;
  let isBoldOpen: boolean = false;

  while( cursor < markdownString.length && peek() ) {
    let current: string | undefined = peek();
    let code: number = peekCode();
    
    if(
      current === "-" || current === "!" || current === "?" || current === "+" 
    ) {
        // List points
      let offset = 2;
      let pointType: ListPointType;
      let nextChar: string | undefined = peek(2);

      if( current === "-" ) {
        pointType = "list-main";

        if( nextChar === "-" || nextChar === ">" ) {
          pointType = (nextChar === "-") ? "list-info" : "list-conclusion";
          offset++;
        } else if( peek(-1) === "\t" ) {
          pointType = "list-con";
        }
      }

      if( peek(offset) === " " ) {
        if( current === "!" ) {
          pointType = "list-important";
        } else if( current === "?" ) {
          pointType = "list-question";
        } else if( current === "+" ) {
          pointType = "list-pro";
        }

        advance(offset);
        token({
          type: pointType!,
          value: ""
        });
      }
    } else if( current === "#" ) {  // Header
      let headerLevel = 3;  // First available header level is 3, last is 5 ()
      let offset = 1;
      const startIndex: number = cursor;

      while( peek(offset) === "#" && headerLevel < 5 ) {
        offset++;
        headerLevel++;
      }

      if( peek(offset) === " " ) {
        advance(offset);
        token({
          type: "header",
          value: copy(startIndex, cursor + 1)
        });
      }
    } 

    code = peekCode();  // Re-peek as the cursor may have moved
    
    if( peek() === "*" ) {  // Italic/bold
      if( peek(2) === "*" ) {
        token({
          type: isBoldOpen ? "bold-end" : "bold",
          value: "**"
        });

        isBoldOpen = !isBoldOpen;
        advance();
      } else {
        token({
          type: isItalicOpen ? "italic-end" : "italic",
          value: "*"
        });

        isItalicOpen = !isItalicOpen;
      }

      advance();
    }
    
    if( code === codeOf("\n") ) {  // Line-breaks
        // Reset text mode
      isBoldOpen = false;
      isItalicOpen = false;

      while( peek() === "\n" ) {
        token({
          type: "line-break",
          value: ""
        });
        advance();
      }
    } else if( code >= 32 ) { // Styled text (bold/italic/plain text)

      const startIndex: number = cursor + 1;

      while( (code = peekCode()) >= 32 && code !== codeOf("\n") && code != codeOf("*") ) {
        advance();
      }

      token({
        type: "text",
        value: copy(startIndex, cursor + 1)
      });
    }
  }

  return tokens;
}


function parse(tokens: MarkdownToken[]): ParseResult {
  const nodes: ReactNode[] = [];
  let cursor: number = -1;

  if( tokens.length === 0 ) {
    return {
      wasSuccessful: true,
      reactNodes: []
    };
  }

  const token = (offset: number = 0): MarkdownToken | undefined => tokens[cursor + offset];

  const advance = (amount: number = 1) => cursor += amount;

  const check = (token: MarkdownToken | undefined, type: TokenType, value?: string) => {
    if( !token ) {
      return false;
    } else if( token.type !== type ) {
      return false;
    } else if( value && token.value !== value ) {
      return false;
    }
    return true;
  };

  const pushNode = (node: ReactNode) => {
    nodes.push(node);
  };

  const text = (): ReactNode => {
    if( !check(token(1), "text") ) {
      return null;
    }

    advance();
    return token()!.value;
  };

  const bold = (): ReactNode[] | ReactNode => {
    if( !check(token(1), "bold") ) {
      return null;
    }

    advance();

    let nextToken: MarkdownToken | undefined;
    const nodes: ReactNode[] = [];

    while( nextToken = token(1) ) {
      if( check(nextToken, "bold-end") ) {
        advance();
        return [<strong>{nodes}</strong>];
      }

      const styledNode: ReactNode[] = styledText();

      if( styledNode.length === 0 ) {
        break;
      }

      nodes.push(styledNode);
    }

    return ["**", ...nodes];
  };
  const italic = (): ReactNode[] | ReactNode => {
    if( !check(token(1), "italic") ) {
      return null;
    }

    advance();

    let nextToken: MarkdownToken | undefined;
    const nodes: ReactNode[] = [];

    while( nextToken = token(1) ) {
      if( check(nextToken, "italic-end") ) {
        advance();
        return [<em>{nodes}</em>];
      }

      const styledNode: ReactNode[] = styledText();

      if( styledNode.length === 0 ) {
        break;
      }

      nodes.push(styledNode);
    }

    return ["*", ...nodes];
  };

  const styledText = (): ReactNode[] => {
    let nextToken: MarkdownToken | undefined;
    const reactNodes: ReactNode[] = [];

    while( nextToken = token(1) ) {
      if( check(nextToken, "bold") ) {
        // reactNodes.push(<strong>{nextToken.value}</strong>);
        // advance();
        reactNodes.push(bold());
      } else if( check(nextToken, "italic") ) {
        reactNodes.push(italic());
        // reactNodes.push(<em>{nextToken.value}</em>);
        // advance();
      } else if( check(nextToken, "text") ) {
        reactNodes.push(text());
      } else {
        if( check(nextToken, "line-break") ) {
          advance();
        }
        break;
      }
    }

    return reactNodes;
  };

  const header = (): ReactNode => {
    let nextToken: MarkdownToken | undefined = token(1);
    if( !check(nextToken, "header") ) {
      return null;
    }

    let node: ReactNode = null;
    advance();
    
    switch( nextToken!.value.length ) {
      case 1: node = <h3>{styledText()}</h3>; break;
      case 2: node = <h4>{styledText()}</h4>; break;
      case 3: node = <h5>{styledText()}</h5>; break;
      default: node = <>#HEADER</>; break;
    }

    return node;
  };

  const listItem = (): ReactNode => {
    const nextToken: MarkdownToken | undefined = token(1);

    if( !nextToken ) {
      return null;
    }
    
    let sign: string;
    switch( nextToken.type ) {
      case "list-con": sign = "-"; break;
      case "list-conclusion": sign = "⇛"; break;
      case "list-important": sign = "!"; break;
      case "list-info": sign = "––"; break;
      case "list-main": sign = "–"; break;
      case "list-pro": sign = "+"; break;
      case "list-question": sign = "?"; break;

      default: return null;
    }

    advance();
    return <><b>{sign}</b> {styledText()}</>;
  };

  const lineBreak = (): ReactNode => {
    if( !check(token(1), "line-break") ) {
      return null;
    }

    advance();
    return <br />;
  };

  while( cursor < tokens.length && token(1) ) {
    let parseResult: ReactNode[] | ReactNode;

    if(
      (parseResult = header()) || 
      (parseResult = listItem()) ||
      (parseResult = lineBreak()) || 
      (parseResult = styledText()) 
    ) {
      pushNode(parseResult);
    } else {
      advance();
    }
  }

  return {
    wasSuccessful: true,
    reactNodes: nodes
  };
}

export function markdownProcessor(markdownString: string): ReactNode[] {
  const tokens: MarkdownToken[] = lex(markdownString);
  // console.log(tokens);
  // return [null];
  const parseResult: ParseResult = parse(tokens);

  if( !parseResult || !parseResult.wasSuccessful ) {
    return [];
  } else {
    return parseResult.reactNodes;
  }
}
