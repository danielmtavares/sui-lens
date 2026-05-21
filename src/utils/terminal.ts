export function truncateMiddle(value: string, visibleChars = 6): string {
  if (value.length <= visibleChars * 2 + 3) {
    return value;
  }

  const start = value.slice(0, visibleChars);
  const end = value.slice(-visibleChars);

  return `${start}...${end}`;
}

export function formatKeyValue(label: string, value: string): string {
  return `${label}: ${value}`;
}
