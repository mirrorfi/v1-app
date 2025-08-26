import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet } from "lucide-react"

export function VaultDashboardBalances() {
  const positions = [
    {
      protocol: "Kamino Main Market",
      protocolLogo: "K",
      token: "USDC",
      tokenLogo: "U",
      amount: "1,000",
      action: "Supply",
      value: "$9,999",
      isPositive: true,
    },
    {
      protocol: "Kamino Main Market",
      protocolLogo: "K",
      token: "SOL",
      tokenLogo: "S",
      amount: "800",
      action: "Borrow",
      value: "$8,999",
      isPositive: false,
    },
    {
      protocol: "Meteora SOL-USDC",
      protocolLogo: "M",
      token: "LP",
      tokenLogo: "L",
      amount: "100",
      action: "DLMM",
      value: "$9,999",
      isPositive: true,
    },
    {
      protocol: "Meteora SOL-USDC",
      protocolLogo: "M",
      token: "SOL",
      tokenLogo: "S",
      amount: "3,000",
      action: "Supply",
      value: "$9,999",
      isPositive: true,
    },
  ]

  const totalValue = 1000
  const duration = "2 days"
  const totalGain = 100

  return (
    <Card className={`bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg ${/*hover:bg-blue-900/30*/""} transition-all duration-200`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-400" />
          Active Positions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        {/* Summary Row */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-white font-semibold">${totalValue.toLocaleString()}</span>
          <span className="text-gray-400">{duration}</span>
          <span className="text-green-400 font-medium">+${totalGain}</span>
        </div>

        {/* Positions List */}
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {positions.slice(0, 2).map((position, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs bg-[#0F1218] rounded p-2 border border-[#2D3748]/30"
            >
              <div className="flex items-center gap-2 w-[50%] min-w-0">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-bold">{position.protocolLogo}</span>
                </div>
                <span className="text-gray-300 truncate text-lg">{position.protocol}</span>
              </div>

              <div className="flex items-center gap-1 w-[30%] justify-start">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">{position.tokenLogo}</span>
                </div>
                <span className="text-white text-lg font-medium">{position.amount}</span>
              </div>

              <div className="flex items-center gap-1 w-[30%] justify-between">
                <Badge
                  className={`text-md px-1 py-0 h-4 ${
                    position.action === "Supply"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : position.action === "Borrow"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  }`}
                >
                  {position.action}
                </Badge>
                <span className={`text-lg font-medium ${position.isPositive ? "text-green-400" : "text-red-400"}`}>
                  {position.isPositive ? "" : "-"}
                  {position.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}