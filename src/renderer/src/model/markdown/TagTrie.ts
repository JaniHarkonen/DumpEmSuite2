import { TagInfo } from "./token.type";


export class TagTrieNode {
  private children: {[key in string]: TagTrieNode};
  private tagString: string;
  private tagInfo: TagInfo | null;

  constructor() {
    this.children = {};
    this.tagString = "";
    this.tagInfo = null;
  }

  public add(char: string): TagTrieNode {
    if( !this.children[char] ) {
      this.children[char] = new TagTrieNode();
    }

    return this.children[char];
  }

  public putValue(tagString: string, tagInfo: TagInfo) {
    this.tagString = tagString;
    this.tagInfo = tagInfo;
  }

  public search(char: string): TagTrieNode {
    return this.children[char];
  }

  public getTagInfo(): TagInfo | null {
    return this.tagInfo;
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


  public put(tagString: string, tagToken: TagInfo): void {
    let finalNode: TagTrieNode = this.root;

    for( let i = 0; i < tagString.length; i++ ) {
      finalNode = finalNode.add(tagString.charAt(i));
    }

    finalNode.putValue(tagString, tagToken);
  }

  public getRoot(): TagTrieNode {
    return this.root;
  }
}
