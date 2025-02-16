export default function modifyArray<T>(item: T, arr: T[], index: number): T[] {
  const copy: T[] = [...arr];
  copy[index] = item;
  return copy;
}
