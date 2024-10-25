type KeyConstructor = (workspaceID: string, parentID: string, childID: string) => string;

export default function keyConstructor(type: string): KeyConstructor {
  return (workspaceID: string, parentID: string, childID: string) => {
    return `${workspaceID}-${parentID}-${type}-${childID}`;
  };
}
