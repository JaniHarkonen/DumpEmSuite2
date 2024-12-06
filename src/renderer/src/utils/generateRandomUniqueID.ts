export default function generateRandomUniqueID(
  prefix: string, suffix: string = ""
): string {
  return (
    prefix + 
    Math.random().toString(16).slice(2) + 
    parseInt(performance.now().toString().replace(".", "")).toString(16) + 
    suffix
  );
}
