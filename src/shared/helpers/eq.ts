export const eq = (a: any, b: any): boolean => {
  if (a === b) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
};
