export default function generateRandomUniqueID(prefix: string, suffix: string = ""): string {
  const id: string = Math.random().toString().slice(2);
  return prefix + id + suffix;
}
