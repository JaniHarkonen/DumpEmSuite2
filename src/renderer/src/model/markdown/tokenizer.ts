import { TagTrie, TagTrieNode } from "./TagTrie";
import { ListPoint, TagInfo, TagType } from "./token.type";
import { MarkdownToken } from "./token.type";

  // Available markdown tags along with their info
export const TAGS: {[key in TagType]: TagInfo} = {
  "chart": {
    opener: {
      type: "chart-open",
      value: "<chart>"
    },
    closer: {
      type: "chart-close",
      value: "</chart>"
    },
    type: "chart",
    allowedTokens: ["plain-text"]
  },
  "underline": {
    opener: {
      type: "underline-open",
      value: "<u>"
    },
    closer: {
      type: "underline-close",
      value: "</u>"
    },
    type: "underline"
  },
  "row": {
    opener: {
      type: "row-open",
      value: "<row>"
    },
    closer: {
      type: "row-close",
      value: "</row>"
    },
    type: "row",
    ignoredTokens: [
      "tab-character",
      "new-line"
    ]
  },
  "col": {
    opener: {
      type: "col-open",
      value: "<col>"
    },
    closer: {
      type: "col-close",
      value: "</col>"
    },
    type: "col",
    ignoredTokens: [
      "tab-character"
    ]
  },
  "quarterly-projection": {
    opener: {
      type: "quarterly-projection-open",
      value: "<quarterly>"
    },
    closer: {
      type: "quarterly-projection-close",
      value: "</quarterly>"
    },
    type: "quarterly-projection",
    allowedTokens: ["id"]
  },
  "annual-projection": {
    opener: {
      type: "annual-projection-open",
      value: "<annual>"
    },
    closer: {
      type: "annual-projection-close",
      value: "</annual>"
    },
    type: "annual-projection",
    allowedTokens: [
      "id",
      "years"
    ]
  },
  "id": {
    opener: {
      type: "id-open",
      value: "<id>"
    },
    closer: {
      type: "id-close",
      value: "</id>"
    },
    type: "id",
    allowedTokens: ["plain-text"]
  },
  "years": {
    opener: {
      type: "years-open",
      value: "<years>"
    },
    closer: {
      type: "years-close",
      value: "</years>"
    },
    type: "years",
    allowedTokens: ["plain-text"]
  }
};

  // Trie for custom tags that will be queried when tokenizing
const TAG_TRIE = new TagTrie();
Object.keys(TAGS).forEach((key: string) => {
  TAG_TRIE.put(TAGS[key].opener.value, TAGS[key]);
  TAG_TRIE.put(TAGS[key].closer.value, TAGS[key]);
});

  // Plain characters of the list points
const LIST_CHARACTERS: { [key in ListPoint]: string } = {
  "list-main": "-", 
  "list-info": "--", 
  "list-conclusion": "->", 
  "list-question": "?", 
  "list-important": "!", 
  "list-pro": "+", 
  "list-con": "-"
};


export function tokenize(input: string): MarkdownToken[] {
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
          value: LIST_CHARACTERS[type!]
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
              type: finalNode.getTagInfo()!.type,
              value: tagString,
              isTag: true
            });
          } else if( tagString === "<" || tagString === "<>" ) {
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
