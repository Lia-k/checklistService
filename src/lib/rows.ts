interface ValueMaps {
  inputValues?: Record<string, unknown>;
  statusValues?: Record<string, unknown>;
}

export function parseRowIdFromKey(key: string): number | null {
  const match = key.match(/-(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : null;
}

export function getMaxRowIdFromTableData(data?: ValueMaps): number {
  if (!data) return 0;
  const keys = [
    ...Object.keys(data.inputValues ?? {}),
    ...Object.keys(data.statusValues ?? {}),
  ];
  let max = 0;
  for (const k of keys) {
    const id = parseRowIdFromKey(k);
    if (id && id > max) max = id;
  }
  return max;
}

