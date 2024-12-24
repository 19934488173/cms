export function def(value) {
  if (typeof value === 'number') {
    return value;
  }
  return value ? '"' + value + '"' : '""';
}
