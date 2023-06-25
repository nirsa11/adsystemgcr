export const isNullOrUndefined = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  return false;
};

export type ValueOf<T> = T[keyof T];
