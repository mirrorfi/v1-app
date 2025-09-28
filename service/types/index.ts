

interface PriceData {
  usdPrice: number;
  priceChange24h: number;
}
enum LogType {
  INFO = "info",
  ERROR = "error",
  WARNING = "warning",
  SUCCESS = "success"
}

export {
    PriceData,
    LogType
}
