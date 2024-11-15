export default class JSONAccessor<S, T extends keyof S> {
  private parentJSON: S;
  private field: T;

  constructor(parentJSON: S, field: T) {
    this.field = field;
    this.parentJSON = parentJSON;
  }


  public update(value: S[T]): void {
    this.parentJSON[this.field] = value;
  }

  public get(): S[T] {
    return this.parentJSON[this.field];
  }
}
