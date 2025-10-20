// Types for chart data
export interface ChartDataItem {
  date: string;
  fullDate: string;
  value: number;
}

export interface HistoricalDataPoint {
  timestamp: string;
  totalNAV: number;
  shareTokenSupply: number;
  depositTokenPrice: number;
}

export interface HistoricalDataResponse {
  vaultAddress: string;
  timeframe: string;
  dataPoints: number;
  data: HistoricalDataPoint[];
}

// Utility function to format date based on timeframe
export const formatDateForTimeframe = (date: Date, timeframe: string): { date: string; fullDate: string } => {
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  };
  
  const fullDate = date.toLocaleDateString('en-GB', options);
  
  switch (timeframe) {
    case "24H":
      return {
        date: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        fullDate
      };
    case "7D":
    case "30D":
    case "90D":
      return {
        date: date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
        fullDate
      };
    default:
      return {
        date: date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
        fullDate
      };
  }
};

// Transform historical data to chart format
export const transformHistoricalData = (
  historicalData: HistoricalDataPoint[],
  dataType: "APY History" | "Share Price" | "Vault NAV",
  timeframe: string
): ChartDataItem[] => {
  if (!historicalData || historicalData.length === 0) {
    return [];
  }

  // Sort data by timestamp to ensure proper chronological order
  const sortedData = [...historicalData].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return sortedData.map((dataPoint, index) => {
    const timestamp = new Date(dataPoint.timestamp);
    const { date, fullDate } = formatDateForTimeframe(timestamp, timeframe);
    
    let value: number;
    
    switch (dataType) {
      case "APY History":
        // For APY, calculate based on share price change over time
        if (index === 0 || !sortedData[0]) {
          value = 0; // First data point has no previous data to compare
        } else {
          const initialSharePrice = sortedData[0].shareTokenSupply > 0 ? 
            sortedData[0].totalNAV / sortedData[0].shareTokenSupply : 1;
          const currentSharePrice = dataPoint.shareTokenSupply > 0 ? 
            dataPoint.totalNAV / dataPoint.shareTokenSupply : 1;
          
          // Calculate time difference in days
          const timeDiff = timestamp.getTime() - new Date(sortedData[0].timestamp).getTime();
          const daysDiff = Math.max(1, timeDiff / (1000 * 60 * 60 * 24));
          
          // Calculate annualized percentage yield
          const priceChange = (currentSharePrice - initialSharePrice) / initialSharePrice;
          value = (priceChange * 365 / daysDiff) * 100;
        }
        break;
        
      case "Share Price":
        // Calculate share price: totalNAV / shareTokenSupply
        value = dataPoint.shareTokenSupply > 0 ? dataPoint.totalNAV / dataPoint.shareTokenSupply : 1;
        break;
        
      case "Vault NAV":
        // Use total NAV directly
        value = dataPoint.totalNAV;
        break;
        
      default:
        value = dataPoint.totalNAV;
    }
    
    return {
      date,
      fullDate,
      value: Number(value.toFixed(6))
    };
  });
};


// Fetch historical vault data
export const fetchHistoricalVaultData = async (
  vaultAddress: string,
  timeframe: string
): Promise<HistoricalDataResponse> => {
  const response = await fetch(`/api/vault/history?vault=${vaultAddress}&timeframe=${timeframe}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch historical data: ${response.statusText}`);
  }
  
  return response.json();
};

// Get chart data for a specific vault, data type, and timeframe
export const getChartData = async (
  vaultAddress: string,
  dataType: "APY History" | "Share Price" | "Vault NAV",
  timeframe: "24H" | "7D" | "30D" | "90D"
): Promise<ChartDataItem[]> => {
  try {
    const historicalResponse = await fetchHistoricalVaultData(vaultAddress, timeframe);
    return transformHistoricalData(historicalResponse.data, dataType, timeframe);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    // Return empty array on error - component can handle fallback to mock data
    return [];
  }
};