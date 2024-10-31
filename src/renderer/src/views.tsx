export interface ViewProps {
  parentID: string;
}

export function formatID(parentID: string | null, id: string) {
  if( parentID ) {
    return `${parentID}-${id}`
  }
  return id;
}
