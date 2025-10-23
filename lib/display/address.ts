export function formatAddress(address: string, length: number = 8): string {
  if (address.length <= length * 2) {
    return address;
  }
  const start = address.slice(0, length);
  const end = address.slice(-length);
  return `${start}...${end}`;
}