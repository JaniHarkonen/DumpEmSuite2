type TrieNodeChildren<T> = {
  [key in string]: TrieNode<T>;
};

type TrieNodeValue<T> = {
  key: string;
  value: T;
};

class TrieNode<T> {
  private children: TrieNodeChildren<T>;
  private value: TrieNodeValue<T> | null;
  
  constructor() {
    this.children = {};
    this.value = null;
  }


  public put(character: string): TrieNode<T> {
    let node: TrieNode<T>;

    if( this.children[character] ) {
      node = this.children[character];
    } else {
      node = new TrieNode();
      this.children[character] = node;
    }

    return node;
  }

  public get(character: string): TrieNode<T> | null {
    return this.children[character] ?? null;
  }

  public setValue(value: TrieNodeValue<T>): void {
    this.value = value;
  }

  public getValue(): TrieNodeValue<T> | null {
    return this.value;
  }

  public getChildren(): TrieNodeChildren<T> {
    return this.children;
  }
}

export default class Trie<T> {
  private root: TrieNode<T>;

  constructor() {
    this.root = new TrieNode();
  }

  public put(item: TrieNodeValue<T>): void {
    let node: TrieNode<T> = this.root;

    for( let i = 0; i < item.key.length; i++ ) {
      node = node.put(item.key.charAt(i));
    }

    node.setValue(item);
  }

  public query(prefix: string): TrieNodeValue<T>[] {
    let node: TrieNode<T> | null = this.root;
    
      // First find the node that corresponds to the end of the prefix
      // If one doesn't exist, no items with the given prefix exist in the trie
    for( let i = 0; i < prefix.length; i++ ) {
      node = node.get(prefix.charAt(i));

      if( !node ) {
        return [];
      }
    }

    return this.toArray(node);
  }

  public all(): TrieNodeValue<T>[] {
    return this.toArray(this.root);
  }

  private toArray(startNode: TrieNode<T>): TrieNodeValue<T> [] {
    const result: TrieNodeValue<T>[] = [];
    let nodeValue: TrieNodeValue<T> | null = startNode.getValue();
    let nodeChildren: TrieNodeChildren<T> = startNode.getChildren();

    if( nodeValue ) {
      result.push(nodeValue);
    }

    for( let key of Object.keys(nodeChildren) ) {
      result.push(...this.toArray(nodeChildren[key]));
    }

    return result;
  }
}
