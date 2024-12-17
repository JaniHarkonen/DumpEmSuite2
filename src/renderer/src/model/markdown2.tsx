type ListPointType = "list-main" | "list-info" | "list-conclusion" | "list-question" | 
  "list-important" | "list-pro" | "list-con" | "list-none";

type MarkdownToken = {
  header: boolean;
  strong: boolean;
  emphasized: boolean;
  listPointType: ListPointType;
  value: string;
};


function lex(input: string): MarkdownToken[] {
  const output: MarkdownToken[] = [];
  let cursor: number = -1;
  let currentToken: MarkdownToken = {
    header: false,
    strong: false,
    emphasized: false,
    listPointType: "list-none",
    value: ""
  };

  const peek = (offset: number = 0): string | undefined => input.charAt(cursor + offset);


  while( peek() ) {
    if( 
      peek() === "#" && 
      currentToken.listPointType === "list-none" && 
      currentToken.value 
    ) {
      
    }
  }

  return output;
}
