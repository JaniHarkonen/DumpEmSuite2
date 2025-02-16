export default function debounce(f: any, delayMS: number): any {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
    if( timeout ) {
      clearTimeout(timeout);
    }

    f.apply(null, args);

    timeout = setTimeout(() => f(), delayMS);
  };
}
