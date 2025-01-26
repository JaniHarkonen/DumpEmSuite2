import { TokenType } from "./token.type";
import { MarkdownToken } from "./tokenizer";

export type ASTNode = {
  type: TokenType;
  children: ASTNode[];
  value?: string;
};

export function parse(input: MarkdownToken[]): ASTNode[] {
  if( input.length === 0 ) {
    return [];
  }

  const output: ASTNode[] = [];
  let cursorPosition: number = -1;

  const peek = (offset: number = 1): MarkdownToken | undefined => input[cursorPosition + offset];

  const peekAt = (position: number): MarkdownToken | undefined => input[position];

  const cursor = (offset: number = 0): number => cursorPosition + offset;

  const check = (token: MarkdownToken | undefined, type: TokenType, value?: string): boolean => {
    if( !token || token.type !== type ) {
      return false;
    }

    return value ? (token.value === value) : true;
  };

  const advance = (offset: number = 1): number => cursorPosition += offset;

  const advanceTo = (position: number): number => cursorPosition = position;

  const pushNode = (...astNode: ASTNode[]) => {
    for( let node of astNode ) {
      output.push(node);
    }
  };

  const findAny = (start: number, ...type: TokenType[]): number => {
    for( let i = start; i < input.length; i++ ) {
      for( let j = 0; j < type.length; j++ ) {
        if( input[i].type === type[j] ) {
          return i;
        }
      }
    }
    return -1;
  };

  const isNewParagraph = (position: number): boolean => {
    return check(peekAt(position), "new-line") && check(peekAt(position + 1), "new-line");
  };

  const header = (): ASTNode | null => {
    if( peek(0) && !check(peek(0), "new-line") ) {
      return null;
    }

      // First, determine if this is a valid header start
    let headerLevel: number = 2;
    let offset: number = 1;

    while( check(peek(offset), "header") && headerLevel < 5 ) {
      headerLevel++;
      offset++;
    }

      // Declaration didn't end in a white space -> not a header
    if( offset === 1 || !check(peek(offset), "white-space") ) {
      return null;
    }

    advance(offset);

      // Next, determine where the header terminates
    let start: number = cursor(1);
    let end: number = findAny(start, "new-line");

    if( peekAt(end + 1)?.type === "new-line" ) {
      end++;
    }

    end = (end >= 0) ? end : input.length;
    advanceTo(end);

      // Finally, parse the contents of the header and create an AST node
    return {
      type: "header",
      children: parse(input.slice(start, end)),
      value: headerLevel.toString()
    };
  };

  const strongOrEmphasized = (): ASTNode | null => {
    const token: MarkdownToken | undefined = peek();

    if( !check(token, "strong") && !check(token, "emphasized") ) {
      return null;
    }

    if( check(peek(2), "white-space") ) {
      return null;
    }

    let type: TokenType = token!.type;
    let offset: number = 3;
    let next: MarkdownToken | undefined;

    while( true ) {
      next = peek(offset);

      if( !next || isNewParagraph(cursor(offset)) ) {
        return null;
      } else if( check(next, type) ) {
        break;
      }

      offset++;
    }

    let end: number = cursor(offset);
    advance(2);

    let start: number = cursor();
    advanceTo(end);

    return {
      type,
      children: parse(input.slice(start, end))
    };
  };

  const listPoint = (): ASTNode | null => {
    if( peek(0) && !check(peek(0), "new-line") && !check(peek(0), "tab-character") ) {
      return null;
    }

    const pointToken: MarkdownToken | undefined = peek(); 

    if( !pointToken ) {
      return null;
    }

    if(
      !check(pointToken, "list-con") && 
      !check(pointToken, "list-conclusion") && 
      !check(pointToken, "list-important") && 
      !check(pointToken, "list-info") && 
      !check(pointToken, "list-main") && 
      !check(pointToken, "list-pro") && 
      !check(pointToken, "list-question")
    ) {
      return null;
    }

    if( !check(peek(2), "white-space") ) {
      return null;
    }

    advance(2);

    const start: number = cursor(1);
    
    while( peek() && !check(peek(), "new-line") ) {
      advance();
    }

    return {
      type: pointToken.type,
      children: parse(input.slice(start, cursor(1))),
      value: pointToken.value
    };
  };

  const link = (): ASTNode | null => {
    if( !check(peek(), "link-label-open") ) {
      return null;
    }

      // Determine, if valid link label
    let offset: number = 2;
    const labelStart: number = cursor(offset);

    while( true ) {
      if( !peek(offset) ) {
        return null;
      }

      if( check(peek(offset), "link-label-close") ) {
        break;
      }

      if( isNewParagraph(cursor(offset)) ) {
        return null;
      }

      offset++;
    }

    const labelEnd: number = cursor(offset);
    offset++;

      // Determine, if valid link
    if( !check(peek(offset), "link-open") ) {
      return null;
    }

    let linkValue: string = "";
    offset++;

    while( true ) {
      if( !peek(offset) ) {
        return null;
      }

      if( check(peek(offset), "link-close") ) {
        break;
      }

      if( isNewParagraph(cursor(offset)) ) {
        return null;
      }

      linkValue += peek(offset)?.value || "";
      offset++;
    }

    offset++;
    advance(offset);

    return {
      type: "link",
      children: parse(input.slice(labelStart, labelEnd)),
      value: linkValue
    };
  };

  const newLine = (): ASTNode | null => {
    if( !check(peek(), "new-line") ) {
      return null;
    }

    advance();

    return {
      type: "new-line",
      children: []
    };
  };

  const tabCharacter = (): ASTNode | null => {
    if( !check(peek(), "tab-character") ) {
      return null;
    }

    advance();

    return {
      type: "tab-character",
      children: []
    };
  };

  const chart = (): ASTNode | null => {
    if( !check(peek(), "chart-open") ) {
      return null;
    }

    let chartLink: string = "";
    advance();

    while( peek() && !check(peek(), "chart-close") ) {
      if( peek()?.type !== "new-line" ) {
        chartLink += peek()!.value;
      }
      advance();
    }

    advance();

    return {
      type: "chart",
      children: [],
      value: chartLink
    };
  };

  const underlined = (): ASTNode | null => {
    if( !check(peek(), "underline-open") ) {
      return null;
    }

    advance();

    const start: number = cursor(1);
    while( peek() && !check(peek(), "underline-close") ) {
      advance();
    }

    advance();

    return {
      type: "underlined",
      children: parse(input.slice(start, cursor()))
    };
  };

  const row = (): ASTNode | null => {
    if( !check(peek(), "row-open") ) {
      return null;
    }

    advance();

    const start: number = cursor(1);
    while( peek() && !check(peek(), "row-close") ) {
      advance();
    }

    advance();

    return {
      type: "row",
      children: parse(input.slice(start, cursor()))
    };
  };

  const asPlainText = (): ASTNode | null => {
    const token: MarkdownToken | undefined = peek();

    if( !token ) {
      return null;
    }

    advance();

    return {
      type: "plain-text",
      children: [],
      value: token.value
    };
  }

  while( peek() ) {
    let astNode: ASTNode | null;

    if(
      (astNode = header()) ||
      (astNode = listPoint()) || 
      (astNode = link()) || 
      (astNode = strongOrEmphasized()) ||
      (astNode = chart()) || 
      (astNode = newLine()) || 
      (astNode = underlined()) || 
      (astNode = row()) || 
      (astNode = tabCharacter()) ||
      (astNode = asPlainText())
    ) {
      pushNode(astNode);
    } else {
      advance();
    }
  }

  return output;
}
