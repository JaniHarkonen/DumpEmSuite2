import { TokenType } from "./token.type";

export class TagTrieNode {
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

export class TagTrie {
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
