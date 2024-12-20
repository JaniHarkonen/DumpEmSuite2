import AdvancedRealTimeWidget from "@renderer/components/tradingview/AdvancedRealTimeWidget";
import { ReactNode } from "react";


type ListPoint = 
  "list-main" | 
  "list-info" | 
  "list-conclusion" | 
  "list-question" | 
  "list-important" | 
  "list-pro" | 
  "list-con"
;

type TokenType = 
  "strong" | 
  "emphasized" | 
  "paragraph" | 
  "header" | 
  "plain-text" | 
  "new-line" | 
  "tab-character" | 
  "ignore-next" | 
  "white-space" | 
  "link-label-open" |
  "link-label-close" |
  "link-open" |
  "link-close" |
  "link" | 
  "chart-open" |
  "chart-close" |
  "chart" | 
  "underline-open" | 
  "underline-close" |
  "underlined" |
  ListPoint;


class TagTrieNode {
  private children: {[key in string]: TagTrieNode};
  private tagString: string;
  private tokenType: TokenType | null;

  constructor() {
    this.children = {};
    this.tagString = "";
    this.tokenType = null;
  }

  public add(char: string): TagTrieNode {
    if( !this.children[char] ) {
      this.children[char] = new TagTrieNode();
    }

    return this.children[char];
  }

  public putValue(tagString: string, tokenType: TokenType) {
    this.tagString = tagString;
    this.tokenType = tokenType;
  }

  public search(char: string): TagTrieNode {
    return this.children[char];
  }

  public getTokenType(): TokenType | null {
    return this.tokenType;
  }

  public getTagString(): string {
    return this.tagString;
  }
}

class TagTrie {
  private root: TagTrieNode;

  constructor() {
    this.root = new TagTrieNode();
  }


  public put(tagString: string, tokenType: TokenType): void {
    let finalNode: TagTrieNode = this.root;

    for( let i = 0; i < tagString.length; i++ ) {
      finalNode = finalNode.add(tagString.charAt(i));
    }

    finalNode.putValue(tagString, tokenType);
  }

  public getRoot(): TagTrieNode {
    return this.root;
  }
}

const TAG_TRIE = new TagTrie();
TAG_TRIE.put("<chart>", "chart-open");
TAG_TRIE.put("</chart>", "chart-close");
TAG_TRIE.put("<u>", "underline-open");
TAG_TRIE.put("</u>", "underline-close");

type MarkdownToken = {
  type: TokenType;
  value: string;
};

  // Plain characters of the list points
const listCharacters: { [key in ListPoint]: string } = {
  "list-main": "-", 
  "list-info": "--", 
  "list-conclusion": "->", 
  "list-question": "?", 
  "list-important": "!", 
  "list-pro": "+", 
  "list-con": "-"
};


function tokenize(input: string): MarkdownToken[] {
  const output: MarkdownToken[] = [];
  let cursorPosition: number = -1;

    // This will be used to accumulate plain text between markdown tokens
    // (by default, all text that cannot be assigned into a token gets assigned
    // to a plain-text token)
  let plainTextAccumulator: string = "";

  const peek = (offset: number = 1): string | undefined => input.charAt(cursorPosition + offset);

  const advance = (offset: number = 1): number => cursorPosition += offset;

  const advanceTo = (position: number): number => cursorPosition = position;

  const token = (token: MarkdownToken) => {
    if( plainTextAccumulator.length > 0 ) {
      output.push({
        type: "plain-text",
        value: plainTextAccumulator
      });
      plainTextAccumulator = "";
    }

    output.push(token);
  };

  while( peek() ) {
    switch( peek() ) {
        // Ignore the effects of the next token
      case "\\": {
        token({
          type: "ignore-next",
          value: "\\"
        });
      } break;

        // Italics and bold
      case "*": {
        if( peek(2) === "*" ) {
          token({
            type: "strong",
            value: "**"
          });
          advance();
        } else {
          token({
            type: "emphasized",
            value: "*"
          });
        }
      } break; 

        // Header
      case "#": {
        token({
          type: "header",
          value: "#"
        });
      } break;

        // List points
      case "-":
      case "!":
      case "?":
      case "+": {
        let type: ListPoint;
  
        if( peek() === "-" ) {
          type = "list-main";
  
          if( peek(2) === ">" ) {
            type = "list-conclusion";
            advance();
          } else if( peek(0) === "\t" ) {
            if( peek(2) === "-" ) {
              type = "list-info";
              advance();
            } else {
              type = "list-con";
            }
          }
        }
  
        if( peek() === "!" ) {
          type = "list-important";
        } else if( peek() === "?" ) {
          type = "list-question";
        } else if( peek() === "+" ) {
          type = "list-pro";
        }
  
        token({
          type: type!,
          value: listCharacters[type!]
        });
      } break;

        // Link label (open)
      case "[": {
        token({
          type: "link-label-open",
          value: "["
        });
      } break; 

        // Link label (close)
      case "]": {
        token({
          type: "link-label-close",
          value: "]"
        });
      } break;

        // Link open
      case "(": {
        token({
          type: "link-open",
          value: "("
        });
      } break;

        // Link close
      case ")": {
        token({
          type: "link-close",
          value: ")"
        });
      } break;

        // White space
      case " ": {
        token({
          type: "white-space",
          value: " "
        });
      } break; 

        // Line break
      case "\n": {
        token({
          type: "new-line",
          value: "\n"
        });
      } break;

        // Tab
      case "\t": {
        token({
          type: "tab-character",
          value: "\t"
        });
      } break;

      default: {
          // Custom tags
        if( peek() === "<" ) {
          let finalNode: TagTrieNode = TAG_TRIE.getRoot();
          let tagString: string = "";

          let i = cursorPosition;
          for( i = cursorPosition + 1; i < input.length; i++ ) {
            const charAt: string = input.charAt(i);
            tagString += charAt;
            finalNode = finalNode.search(charAt);

            if( charAt === ">" ) {
              break;
            }

            if( !finalNode ) {
              plainTextAccumulator += tagString;
              break;
            }
          }

          advanceTo(i - 1);
          
          if( finalNode?.getTagString() === tagString ) {
            token({
              type: finalNode.getTokenType()!,
              value: tagString
            });
          } else {
            plainTextAccumulator += tagString;
          }
        } else {
            // Text between tokens is considered plain text
          plainTextAccumulator += peek();
        }

      } break;
    }

    advance();
  }

  if( plainTextAccumulator.length > 0 ) {
    output.push({
      type: "plain-text",
      value: plainTextAccumulator
    });
  }

  return output;
}

type ASTNode = {
  type: TokenType;
  children: ASTNode[];
  value?: string;
};

function parse(input: MarkdownToken[]): ASTNode[] {
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
  }

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
      (astNode = asPlainText())
    ) {
      pushNode(astNode);
    } else {
      advance();
    }
  }

  return output;
}

function renderAST(astNodes: ASTNode[], keyPrefix: string = ""): ReactNode[] {
  return astNodes.map((astNode: ASTNode, index: number) => {
    let key: string = `${keyPrefix}-${astNode.type}-${index.toString()}`;

    if( astNode.type === "plain-text" || astNode.type === "white-space" ) {
      return <span key={`${key}-span`}>{astNode.value}</span>;
    }

    const childNodes: ReactNode[] = renderAST(astNode.children, key);

    switch( astNode.type ) {
      case "new-line": return <br key={key} />;
      case "strong": return <strong key={key}>{childNodes}</strong>;
      case "emphasized": return <em key={key}>{childNodes}</em>;
      case "list-con": return <span key={key}><strong>-</strong>{childNodes}</span>;
      case "list-conclusion": return <span key={key}><strong>⇛</strong>{childNodes}</span>;
      case "list-important": return <span key={key}><strong>!</strong>{childNodes}</span>;
      case "list-info": return <span key={key}><strong>––</strong>{childNodes}</span>;
      case "list-main": return <span key={key}><strong>–</strong>{childNodes}</span>;
      case "list-pro": return <span key={key}><strong>+</strong>{childNodes}</span>;
      case "list-question": return <span key={key}><strong>?</strong>{childNodes}</span>;
      case "underlined": console.log("is");return <u key={key}>{childNodes}</u>;
      case "header": {
        switch( astNode.value ) {
          case "3": return <h3 key={key}>{childNodes}</h3>;
          case "4": return <h4 key={key}>{childNodes}</h4>;
          case "5": return <h5 key={key}>{childNodes}</h5>;
        }
      } break;
      case "link": {
        return (
          <a
            key={key}
            href={astNode.value}
          >
            {childNodes}
          </a>
        );
      }
      case "chart": {
        const split: string[] = astNode.value!.split(":");

        if( split.length !== 2 ) {
          return [];
        }

        return (
          <AdvancedRealTimeWidget
            key={`${key}-${astNode.value}`}
            exchange={split[0]}
            ticker={split[1]}
          />
        );
      }
    }

    return [];
  });
}

export function renderMarkdown(markdownString: string): ReactNode[] {
  return renderAST(parse(tokenize(markdownString)));
}
