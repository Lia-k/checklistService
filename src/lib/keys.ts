export function cellKey(column: string, rowId: number, prefix?: string): string {
  const base = (prefix ?? column).trim().replace(/\s+/g, "-");
  return `${base}-${rowId}`;
}

