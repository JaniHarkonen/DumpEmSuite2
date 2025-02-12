export default function removeArrayIndex<T>(arr: T[], index: number): T[] {
  if( arr.length === 0 ) {
    return [];
  }

  const result: T[] = [...arr];
  result.splice(index, 1);
  return result;
}
