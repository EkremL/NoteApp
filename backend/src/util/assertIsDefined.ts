export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (!val) {
    throw Error("Expected 'val' to be defined but received" + val);
  }
  // if (val === undefined || val === null) {
  //   throw new Error("Expected 'val' to be defined, but received " + val);
  // }
}
