export default function debounce(f: any, delayMS: number): any {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
    if( timeout ) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => f.apply(null, args), delayMS);
  };
}
