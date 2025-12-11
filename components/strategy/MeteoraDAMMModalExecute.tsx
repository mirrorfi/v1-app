"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, ArrowLeft } from "lucide-react"

interface TokenOption {
  mint: string;
  symbol: string;
  icon: string;
  decimals?: number;
  usdPrice?: number;
}

interface PoolInfo {
  address: string;
  tokenA: TokenOption;
  tokenB: TokenOption;
  priceRange?: string;
  baseFee: string;
  totalLiquidity: number;
  volume24h: number;
  feeToTVL24h: number;
}

interface MeteoraDAMMModalExecuteProps {
  selectedPool: PoolInfo;
  action: 'add' | 'reduce' | 'new';
  onBack: () => void;
}

export function MeteoraDAMMModalExecute({ selectedPool, action, onBack }: MeteoraDAMMModalExecuteProps) {
  const defaultTab = action === "reduce" ? "reduce":"add"
  const [activeTab, setActiveTab] = useState<'add'|'reduce'>(defaultTab)
  const [amountTokenA, setAmountTokenA] = useState<string>('');
  const [amountTokenB, setAmountTokenB] = useState<string>('');
  const [slippage, setSlippage] = useState<number>(0.1);
  const [customSlippage, setCustomSlippage] = useState<string>('');
  const [showSlippageTooltip, setShowSlippageTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock position data - TODO: Replace with actual position data from props
  const mockPosition = {
    exists: false, // Set to true when position exists
    initialCapital: 199.00,
    initialCapitalToken: "200 USDC",
    positionValue: 199.00,
    positionValueBreakdown: "() 0.98 SOL + () 100 USDC",
    generatedFees: 0.372,
    generatedFeesBreakdown: "() 0.001 SOL + () 0.17 USDC"
  };

  const handleAmountChange = (value: string, setter: (val: string) => void) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleSlippageSelect = (value: number) => {
    setSlippage(value);
    setCustomSlippage('');
    setShowSlippageTooltip(false);
  };

  const handleCustomSlippageChange = (value: string) => {
    // Only accept numbers with max 2 decimal points
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      const numValue = parseFloat(value);
      // Check if value is valid and within range (0-10)
      if (value === '' || (numValue >= 0 && numValue <= 10)) {
        setCustomSlippage(value);
        // Only update slippage if it's a valid number
        if (!isNaN(numValue)) {
          setSlippage(numValue);
        }
      }
    }
  };

  const handleExecuteStrategy = async () => {
    setIsLoading(true);
    //await onExecute({ activeTab: tab, amountTokenA, amountTokenB, slippage });
    setIsLoading(false);
  };

  return (
    <div className="relative space-y-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-slate-400 hover:text-white hover:bg-slate-800/50 p-2 h-auto"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to pool selection
      </Button>

      {/* Position Info (if exists) */}
      {mockPosition.exists && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-slate-800/50 border-slate-600/30">
            <CardContent className="p-3">
              <div className="text-slate-400 text-xs mb-1">Initial Capital</div>
              <div className="text-white font-semibold text-lg">${mockPosition.initialCapital}</div>
              <div className="text-slate-400 text-xs">{mockPosition.initialCapitalToken}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-600/30">
            <CardContent className="p-3">
              <div className="text-slate-400 text-xs mb-1">Position Value</div>
              <div className="text-white font-semibold text-lg">${mockPosition.positionValue}</div>
              <div className="text-slate-400 text-xs">{mockPosition.positionValueBreakdown}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-600/30 col-span-2">
            <CardContent className="p-3">
              <div className="text-slate-400 text-xs mb-1">Generated Fees</div>
              <div className="text-white font-semibold text-lg">${mockPosition.generatedFees}</div>
              <div className="text-slate-400 text-xs">{mockPosition.generatedFeesBreakdown}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add/Reduce Tabs & Slippage */}
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-800/50 rounded-lg">
          <button
            className={`px-4 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'add' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('add')}
          >
            Add
          </button>
          <button
            className={`px-4 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'reduce' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('reduce')}
          >
            Reduce
          </button>
        </div>

        {/* Slippage Selector */}
        <div className="relative">
          <Button
            variant="outline"
            className="bg-slate-800/50 border-slate-600/30 text-white hover:bg-slate-700/50"
            onClick={() => setShowSlippageTooltip(!showSlippageTooltip)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {slippage}%
          </Button>
          
          {showSlippageTooltip && (
            <>
              {/* Backdrop to close dropdown */}
              <div 
                className="fixed inset-0 z-[200]" 
                onClick={() => setShowSlippageTooltip(false)}
              />
              
              {/* Dropdown content */}
              <div className="absolute right-0 top-full mt-2 bg-slate-800 border border-slate-600/30 rounded-lg p-3 shadow-lg z-[250] min-w-[200px]">
                <div className="space-y-2">
                  <div className="text-xs text-slate-400 mb-3">Slippage Tolerance</div>
                  <div className="flex gap-2">
                    {[0.1, 0.5, 1.0].map((value) => (
                      <button
                        key={value}
                        className={`px-3 py-1 text-xs rounded ${
                          slippage === value && !customSlippage
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-400 hover:text-white'
                        }`}
                        onClick={() => handleSlippageSelect(value)}
                      >
                        {value}%
                      </button>
                    ))}
                  </div>
                  <Input
                    type="text"
                    placeholder="Custom"
                    value={customSlippage}
                    onChange={(e) => handleCustomSlippageChange(e.target.value)}
                    className="w-full bg-slate-700/50 border-slate-600/30 text-white text-xs placeholder:text-slate-500"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Token Inputs based on mode */}
      {activeTab === 'add' ? (
        <div className="space-y-3">
          {/* Token A Input */}
          <Card className="bg-slate-800/50 border-slate-600/30">
            <CardContent className="px-4 py-2 md:py-0 pointer-events-auto">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={selectedPool.tokenA.icon} alt={selectedPool.tokenA.symbol} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="text-white font-medium">{selectedPool.tokenA.symbol}</div>
                    <div className="text-slate-400 text-sm">Balance: 100</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[25, 50, 100].map((percentage) => (
                    <button
                      key={percentage}
                      className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-700/50"
                      onClick={() => setAmountTokenA((100 * percentage / 100).toString())}
                    >
                      {percentage}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between relative">
                <input
                  type="text"
                  value={amountTokenA}
                  onChange={(e) => handleAmountChange(e.target.value, setAmountTokenA)}
                  placeholder="0.0"
                  className="bg-transparent text-white text-lg font-medium outline-none flex-1 relative z-10 pointer-events-auto"
                />
                <span className="text-gray-400 text-sm ml-2">${((Number(amountTokenA) || 0) * (selectedPool.tokenA.usdPrice||0)).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Token B Input */}
          <Card className="bg-slate-800/50 border-slate-600/30">
            <CardContent className="px-4 py-2 md:py-0 pointer-events-auto">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={selectedPool.tokenB.icon} alt={selectedPool.tokenB.symbol} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="text-white font-medium">{selectedPool.tokenB.symbol}</div>
                    <div className="text-slate-400 text-sm">Balance: 1000</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[25, 50, 100].map((percentage) => (
                    <button
                      key={percentage}
                      className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-700/50"
                      onClick={() => setAmountTokenB((1000 * percentage / 100).toString())}
                    >
                      {percentage}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between relative">
                <input
                  type="text"
                  value={amountTokenB}
                  onChange={(e) => handleAmountChange(e.target.value, setAmountTokenB)}
                  placeholder="0.0"
                  className="bg-transparent text-white text-lg font-medium outline-none flex-1 relative z-10 pointer-events-auto"
                />
                <span className="text-gray-400 text-sm ml-2">${((Number(amountTokenB) || 0) * (selectedPool.tokenB.usdPrice||0)).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Add Summary */}
          <Card className="bg-yellow-900/20 border-yellow-600/30">
            <CardContent className="px-4">
              <div className="text-yellow-400 text-md font-semibold mb-1">Summary:</div>
              <div className="text-yellow-100 text-xs flex items-center flex-wrap gap-1">
                <span>You will deposit</span>
                <div className="flex items-center gap-1">
                  <img src={selectedPool.tokenA.icon} alt={selectedPool.tokenA.symbol} className="w-4 h-4 rounded-full" />
                  <span>{amountTokenA || '0'} {selectedPool.tokenA.symbol}</span>
                </div>
                <span>+</span>
                <div className="flex items-center gap-1">
                  <img src={selectedPool.tokenB.icon} alt={selectedPool.tokenB.symbol} className="w-4 h-4 rounded-full" />
                  <span>{amountTokenB || '0'} {selectedPool.tokenB.symbol}</span>
                </div>
                <span>(${((Number(amountTokenA) || 0) + (Number(amountTokenB) || 0)).toFixed(2)})</span>
              </div>
              <div className="text-yellow-100 text-xs mt-1">Max Slippage: {slippage}%</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Reduce Position Input */}
          <Card className="bg-slate-800/50 border-slate-600/30">
            <CardContent className="px-4 py-2 pointer-events-auto">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-2">
                    <img src={selectedPool.tokenA.icon} alt={selectedPool.tokenA.symbol} className="w-8 h-8 rounded-full border-2 border-slate-800" />
                    <img src={selectedPool.tokenB.icon} alt={selectedPool.tokenB.symbol} className="w-8 h-8 rounded-full border-2 border-slate-800" />
                  </div>
                  <div>
                    <div className="text-white font-medium">LP Position</div>
                    <div className="text-slate-400 text-sm">Balance: 100</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[25, 50, 100].map((percentage) => (
                    <button
                      key={percentage}
                      className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-700/50"
                      onClick={() => setAmountTokenA((100 * percentage / 100).toString())}
                    >
                      {percentage}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between relative">
                <input
                  type="text"
                  value={amountTokenA}
                  onChange={(e) => handleAmountChange(e.target.value, setAmountTokenA)}
                  placeholder="0.0"
                  className="bg-transparent text-white text-lg font-medium outline-none flex-1 relative z-10 pointer-events-auto"
                />
                <span className="text-gray-400 text-sm ml-2">${(Number(amountTokenA) || 0).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Reduce Summary */}
          <Card className="bg-yellow-900/20 border-yellow-600/30">
            <CardContent className="px-4">
              <div className="text-yellow-400 text-md font-semibold mb-1">Summary:</div>
              <div className="text-yellow-100 text-xs">
                You will receive approximately:
              </div>
              <div className="text-yellow-100 text-xs mt-1 flex items-center gap-1">
                <span>•</span>
                <img src={selectedPool.tokenA.icon} alt={selectedPool.tokenA.symbol} className="w-4 h-4 rounded-full" />
                <span>{((Number(amountTokenA) || 0) * 0.5).toFixed(2)} {selectedPool.tokenA.symbol}</span>
              </div>
              <div className="text-yellow-100 text-xs flex items-center gap-1">
                <span>•</span>
                <img src={selectedPool.tokenB.icon} alt={selectedPool.tokenB.symbol} className="w-4 h-4 rounded-full" />
                <span>{((Number(amountTokenA) || 0) * 0.5).toFixed(2)} {selectedPool.tokenB.symbol}</span>
              </div>
              <div className="text-yellow-100 text-xs mt-1">Max Slippage: {slippage}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Execute Button */}
      <Button
        onClick={handleExecuteStrategy}
        disabled={isLoading || (activeTab === 'add' ? !amountTokenA || !amountTokenB : !amountTokenA)}
        className="w-full h-14 mb-4 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      >
        {isLoading ? "Executing..." : "Execute Strategy"}
      </Button>
    </div>
  );
}
