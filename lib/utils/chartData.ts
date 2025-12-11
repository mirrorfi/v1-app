import { DataType, TimeFrame } from "@/components/VaultDashboardChart";

// Types for chart data
export interface ChartDataItem {
  timestamp: Date;
  value: number;
  "X-Axis": string;
}

export interface HistoricalDataPoint {
  timestamp: string;
  tokenNav: number;     // Vault valuation in USDC
  usdNav: number;       // Vault valuation in USD
  userDeposits: number; // User deposits adjusted by decimals
}

export interface HistoricalDataResponse {
  vaultAddress: string;
  timeframe: TimeFrame;
  dataPoints: number;
  data: HistoricalDataPoint[];
}

// Transform historical data to chart format
export const transformHistoricalData = (
  historicalData: HistoricalDataPoint[],
  dataType: DataType,
  timeframe: TimeFrame
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
  
    let value: number;
    
    switch (dataType) {
        
      case "TokenNav":
        // Vault valuation in USDC (already calculated by indexer)
        value = dataPoint.tokenNav || 0;
        break;
        
      case "UsdNav":
        // Vault valuation in USD
        value = dataPoint.usdNav || 0;
        break;
        
      case "UserDeposits":
        // User deposits adjusted by decimals
        value = dataPoint.userDeposits || 0;
        break;
        
      default:
        value = dataPoint.usdNav || 0;
    }
    
    return {
      timestamp,
      value: Number(value),
      "X-Axis": timeframe === "24H" ? `${timestamp.getHours()}:${timestamp.getMinutes().toString().padStart(2, '0')}` : `${timestamp.getMonth()+1}/${timestamp.getDate()}`
    };
  });
};


// Cache for storing historical data responses
// Key format: "vaultAddress:timeframe"
const historicalDataCache = new Map<string, HistoricalDataResponse>();

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
  dataType: DataType,
  timeframe: TimeFrame,
  updateData = false
): Promise<ChartDataItem[]> => {
  try {
    const cacheKey = `${vaultAddress}:${timeframe}`;
    
    // If updateData is true, fetch fresh data and update cache
    if (updateData) {
      const historicalResponse = await fetchHistoricalVaultData(vaultAddress, timeframe);
      historicalDataCache.set(cacheKey, historicalResponse);
      return transformHistoricalData(historicalResponse.data, dataType, timeframe);
    } 
    
    // If updateData is false, try to use cached data
    const cachedResponse = historicalDataCache.get(cacheKey);
    
    if (cachedResponse) {
      // Use cached data
      return transformHistoricalData(cachedResponse.data, dataType, timeframe);
    } else {
      // No cached data available, fetch it and cache it
      const historicalResponse = await fetchHistoricalVaultData(vaultAddress, timeframe);
      console.log('Fetched fresh historical data:', historicalResponse);
      historicalDataCache.set(cacheKey, historicalResponse);
      return transformHistoricalData(historicalResponse.data, dataType, timeframe);
    }
  } catch (error) {
    console.error('Error fetching chart data:', error);
    // Return empty array on error
    return [];
  }
};

export const clearChartDataCache = (vaultAddress?: string, timeframe?: string) => {
  if (vaultAddress && timeframe) {
    // Clear specific cache entry
    historicalDataCache.delete(`${vaultAddress}:${timeframe}`);
  } else if (vaultAddress) {
    // Clear all entries for a specific vault
    const keysToDelete = Array.from(historicalDataCache.keys()).filter(key => 
      key.startsWith(`${vaultAddress}:`)
    );
    keysToDelete.forEach(key => historicalDataCache.delete(key));
  } else {
    historicalDataCache.clear();
  }
};