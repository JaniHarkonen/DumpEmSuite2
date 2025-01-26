export default function copyJSON<T>(json: any, omittedFields: string[] = []): T {
  const result: any = {};

  Object.keys(json).forEach((key: string) => {
    if( !omittedFields.includes(key) ) {
      result[key] = json[key];
    }
  });

  return result;
}
