export type AsString<T> = {
  [key in keyof T]: string;
};
