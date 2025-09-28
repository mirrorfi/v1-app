// Format Number to a string with commas and fixed decimals
export function formatNumber(value: number, decimals: number = 2): string {
  const threshold = 10 ** (-decimals);
  // For low numbers, display <0.01
  if (value == 0){
    return "0." + "0".repeat(decimals)
  }
  if (value < threshold) {
    return `<${threshold.toFixed(decimals)}`
  }
  else{
    return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
}