import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { StrategyFlow } from "@/components/StrategyFlow";

interface VaultDashboardFlowProps {
    vaultData: any;
    depositData: any;
    strategyData: any;
}

export function VaultDashboardFlow({ vaultData, depositData, strategyData }: VaultDashboardFlowProps) {

    return (
        <Card className={`h-[300px] sm:h-[425px] bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-lg shadow-lg ${/*hover:bg-blue-900/30*/""} transition-all duration-200`}>
        <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            { vaultData ? vaultData.name : <div className="h-5 w-32 bg-blue-700/30 rounded-md animate-pulse" />}
            </CardTitle>
            { vaultData ?
            <div className="text-sm text-blue-300 mt-1">{vaultData.description}</div>
            : <div className="h-4 w-full md:w-3/4 bg-blue-700/30 rounded-md mt-2 animate-pulse" />}
        </CardHeader>
        {depositData && strategyData &&
            <CardContent>
                <StrategyFlow depositData={depositData} strategyData={strategyData} />
            </CardContent>
        }
        </Card>
    )
}