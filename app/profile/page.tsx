"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GridStyleBackground } from "@/components/ui/GridStyleBackground"
import { Navbar } from "@/components/Navbar"
import { useIsMobile } from "@/lib/hooks/useIsMobile"
import { getMultipleVaultBalances, getUserPositions } from "@/lib/api"
import { useEffect, useState, useMemo } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/navigation"
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    Wallet, 
    PieChart, 
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    ExternalLink,
    ChevronRight,
    RefreshCw,
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Info,
    Filter,
    LayoutGrid,
    List,
    AlertCircle
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { 
    PieChart as RechartsPieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    Tooltip as RechartsTooltip,
    Legend,
    XAxis,
    YAxis,
    CartesianGrid,
    Area,
    AreaChart
} from "recharts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"

interface UserPosition {
    vaultDepositor: string;
    vault: string;
    vaultName: string;
    shares: number;
    value: number;
    depositToken: {
        symbol: string;
        icon: string;
    };
    change24h?: number;
}

interface PortfolioStats {
    totalValue: number;
    totalPnL: number;
    pnlPercentage: number;
    positionsCount: number;
    bestPerformer?: {
        name: string;
        change: number;
    };
}

const CHART_COLORS = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#f97316', // orange
    '#6366f1', // indigo
];

export default function ProfilePage() {
    const isMobile = useIsMobile()
    const {publicKey} = useWallet();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [userPositions, setUserPositions] = useState<UserPosition[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState<"value" | "change" | "name">("value");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchUserPositions = async () => {
        if(!publicKey) return;
        setIsLoading(true);
        setError(null);
        try {
            const userPositionData = await getUserPositions(publicKey.toBase58());
            const userPositions: Record<string, any> = {}
            for(const userPosition of userPositionData){
                userPositions[userPosition.vault] = userPosition;
            }
            
            if (!userPositionData || userPositionData.length === 0) {
                setUserPositions([]);
                setIsLoading(false);
                return;
            }
            
            const vaultPdas = userPositionData.map((vp: any) => vp.vault);
            const vaultBalancesData = await getMultipleVaultBalances(vaultPdas);
        
            const userPosition: UserPosition[] = [];
            vaultBalancesData.forEach((vault: any, index: number) => {
                const vaultData = vault.vault;
                const vaultDepositor = userPositions[vaultData.publicKey];
                // TODO: See Data Logged on this message
                console.log(vaultData); // Vault Information
                console.log(vaultDepositor); // User Position Information
                userPosition.push({
                    vaultDepositor: vaultDepositor.publicKey,
                    vault: vaultDepositor.vault,
                    vaultName: vaultData?.name || "Unknown Vault",
                    shares: vaultDepositor.shares,
                    value: (Number(vaultDepositor.shares) / Number(vaultData.totalShares)) * Number(vaultData.totalNav),
                    depositToken: {
                        symbol: vaultData?.symbol || "UNKNOWN",
                        icon: vaultData?.icon || "",
                    },
                    change24h: ((vaultData.publicKey.charCodeAt(0) + vaultData.publicKey.charCodeAt(1)) % 40) - 20, // Deterministic mock based on vault address
                });
            });
            setUserPositions(userPosition);
        } catch (error: any) {
            console.error("Error fetching user positions:", error);
            setError(error?.message || "Failed to load positions. Please try again.");
            setUserPositions([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUserPositions();
    }, [publicKey]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchUserPositions();
    };

    // Calculate portfolio stats
    const portfolioStats: PortfolioStats = useMemo(() => {
        if (userPositions.length === 0) {
            return {
                totalValue: 0,
                totalPnL: 0,
                pnlPercentage: 0,
                positionsCount: 0,
            };
        }

        const totalValue = userPositions.reduce((sum, pos) => sum + pos.value, 0);
        const totalPnL = userPositions.reduce((sum, pos) => sum + (pos.value * (pos.change24h || 0) / 100), 0);
        const pnlPercentage = totalValue > 0 ? (totalPnL / totalValue) * 100 : 0;
        
        const bestPerformer = userPositions.reduce((best, pos) => {
            return (!best || (pos.change24h || 0) > best.change) 
                ? { name: pos.vaultName, change: pos.change24h || 0 }
                : best;
        }, undefined as { name: string; change: number } | undefined);

        return {
            totalValue,
            totalPnL,
            pnlPercentage,
            positionsCount: userPositions.length,
            bestPerformer,
        };
    }, [userPositions]);

    // Prepare allocation data for pie chart
    const allocationData = useMemo(() => {
        return userPositions.map((position, index) => ({
            name: position.vaultName,
            value: position.value,
            percentage: portfolioStats.totalValue > 0 
                ? (position.value / portfolioStats.totalValue * 100).toFixed(1)
                : 0,
            color: CHART_COLORS[index % CHART_COLORS.length],
        }));
    }, [userPositions, portfolioStats.totalValue]);

    // Mock performance data - replace with real historical data
    const performanceData = useMemo(() => {
        const days = 7;
        const data = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: portfolioStats.totalValue * (1 - (Math.random() * 0.1 - 0.05)),
            });
        }
        return data;
    }, [portfolioStats.totalValue]);

    const handlePositionClick = (vaultAddress: string) => {
        router.push(`/vault/${vaultAddress}`);
    };

    // Filter and sort positions
    const filteredAndSortedPositions = useMemo(() => {
        let filtered = userPositions;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(pos =>
                pos.vaultName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pos.depositToken.symbol.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            let compareValue = 0;
            
            switch (sortField) {
                case "value":
                    compareValue = a.value - b.value;
                    break;
                case "change":
                    compareValue = (a.change24h || 0) - (b.change24h || 0);
                    break;
                case "name":
                    compareValue = a.vaultName.localeCompare(b.vaultName);
                    break;
            }
            
            return sortDirection === "asc" ? compareValue : -compareValue;
        });

        return sorted;
    }, [userPositions, searchQuery, sortField, sortDirection]);

    const handleSort = (field: "value" | "change" | "name") => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };

    // Custom tooltip for pie chart
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
                    <p className="text-sm text-slate-300 font-medium">{payload[0].name}</p>
                    <p className="text-lg text-white font-bold">${payload[0].value.toFixed(2)}</p>
                    <p className="text-xs text-slate-400">{payload[0].payload.percentage}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-black">
            <GridStyleBackground />
            {!isMobile && <Navbar />}

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <Wallet className="h-8 w-8 md:h-10 md:w-10 text-blue-400" />
                        Portfolio Dashboard
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base">
                        Track your positions and performance across all vaults
                    </p>
                </div>

                {/* Wallet Connection Check */}
                {!publicKey ? (
                    <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-xl shadow-lg">
                        <CardContent className="p-12 text-center">
                            <Wallet className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
                            <p className="text-slate-400 mb-6">
                                Please connect your wallet to view your portfolio
                            </p>
                        </CardContent>
                    </Card>
                ) : isLoading ? (
                    <LoadingState />
                ) : userPositions.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* Portfolio Overview Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div>
                                            <StatCard
                                                title="Total Value"
                                                value={`$${portfolioStats.totalValue.toFixed(2)}`}
                                                icon={DollarSign}
                                                color="blue"
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Total value of all your positions</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div>
                                            <StatCard
                                                title="24h P&L"
                                                value={`$${portfolioStats.totalPnL.toFixed(2)}`}
                                                subValue={`${portfolioStats.pnlPercentage >= 0 ? '+' : ''}${portfolioStats.pnlPercentage.toFixed(2)}%`}
                                                icon={portfolioStats.pnlPercentage >= 0 ? TrendingUp : TrendingDown}
                                                color={portfolioStats.pnlPercentage >= 0 ? "green" : "red"}
                                                isPositive={portfolioStats.pnlPercentage >= 0}
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Profit/Loss over the last 24 hours</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div>
                                            <StatCard
                                                title="Active Positions"
                                                value={portfolioStats.positionsCount.toString()}
                                                icon={Activity}
                                                color="purple"
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Number of vaults you're invested in</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div>
                                            <StatCard
                                                title="Best Performer"
                                                value={portfolioStats.bestPerformer?.name.slice(0, 12) || "N/A"}
                                                subValue={portfolioStats.bestPerformer ? `+${portfolioStats.bestPerformer.change.toFixed(2)}%` : ""}
                                                icon={ArrowUpRight}
                                                color="green"
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{portfolioStats.bestPerformer?.name || "No data"}</p>
                                        <p className="text-xs text-slate-400">Your top performing vault</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Performance Chart */}
                            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm rounded-xl shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <Activity className="h-5 w-5 text-blue-400" />
                                            Portfolio Performance
                                        </h3>
                                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                            7 Days
                                        </Badge>
                                    </div>
                                    <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                                        <AreaChart data={performanceData}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                            <XAxis 
                                                dataKey="date" 
                                                stroke="#64748b" 
                                                style={{ fontSize: isMobile ? '10px' : '12px' }}
                                            />
                                            <YAxis 
                                                stroke="#64748b" 
                                                style={{ fontSize: isMobile ? '10px' : '12px' }}
                                                tickFormatter={(value) => `$${value.toFixed(0)}`}
                                            />
                                            <RechartsTooltip
                                                contentStyle={{
                                                    backgroundColor: '#1e293b',
                                                    border: '1px solid #334155',
                                                    borderRadius: '8px',
                                                }}
                                                formatter={(value: any) => [`$${value.toFixed(2)}`, 'Value']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorValue)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Asset Allocation Chart */}
                            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30 backdrop-blur-sm rounded-xl shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <PieChart className="h-5 w-5 text-purple-400" />
                                            Asset Allocation
                                        </h3>
                                    </div>
                                    <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                                        <RechartsPieChart>
                                            <Pie
                                                data={allocationData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={isMobile ? 40 : 60}
                                                outerRadius={isMobile ? 70 : 90}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {allocationData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip content={<CustomTooltip />} />
                                            {!isMobile && (
                                                <Legend
                                                    verticalAlign="middle"
                                                    align="right"
                                                    layout="vertical"
                                                    iconType="circle"
                                                    formatter={(value, entry: any) => (
                                                        <span className="text-xs text-slate-300">
                                                            {value.slice(0, 15)} ({entry.payload.percentage}%)
                                                        </span>
                                                    )}
                                                />
                                            )}
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Error State */}
                        {error && (
                            <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-700/30 backdrop-blur-sm rounded-xl shadow-lg mb-6">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-red-500/20 rounded-lg flex-shrink-0">
                                            <AlertCircle className="h-6 w-6 text-red-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-red-400 font-semibold text-lg mb-2">Error Loading Positions</h3>
                                            <p className="text-red-300 mb-4">{error}</p>
                                            <Button
                                                onClick={handleRefresh}
                                                variant="outline"
                                                size="sm"
                                                disabled={isRefreshing}
                                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                            >
                                                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                                Retry
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Positions Section */}
                        <div className="mb-8">
                            {/* Header with Search and Actions */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-blue-400" />
                                        Your Positions
                                    </h2>
                                    <Badge variant="secondary" className="bg-slate-700/50 text-slate-300">
                                        {filteredAndSortedPositions.length} {filteredAndSortedPositions.length === 1 ? 'Position' : 'Positions'}
                                    </Badge>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    {/* Search */}
                                    <div className="relative flex-1 md:w-64">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search vaults..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 bg-slate-800/50 border-slate-600/30 text-white placeholder:text-slate-400 focus:border-blue-500/50"
                                        />
                                    </div>

                                    {/* View Toggle */}
                                    <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-600/30">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setViewMode("table")}
                                            className={`h-8 w-8 p-0 ${viewMode === "table" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                                        >
                                            <List className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setViewMode("grid")}
                                            className={`h-8 w-8 p-0 ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                                        >
                                            <LayoutGrid className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Refresh Button */}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleRefresh}
                                                    disabled={isRefreshing}
                                                    className="bg-slate-800/50 border-slate-600/30 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                                >
                                                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Refresh data</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            {/* Table or Grid View */}
                            {viewMode === "table" ? (
                                <PositionsTable
                                    positions={filteredAndSortedPositions}
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                    onSort={handleSort}
                                    onRowClick={handlePositionClick}
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredAndSortedPositions.map((position) => (
                                        <PositionCard
                                            key={position.vault}
                                            position={position}
                                            onClick={() => handlePositionClick(position.vault)}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Empty Search Results */}
                            {filteredAndSortedPositions.length === 0 && searchQuery && (
                                <Card className="bg-slate-800/30 border-slate-600/20 rounded-xl">
                                    <CardContent className="p-12 text-center">
                                        <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
                                        <p className="text-slate-400 mb-4">
                                            No positions match your search "{searchQuery}"
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSearchQuery("")}
                                            className="bg-slate-800/50 border-slate-600/30 text-slate-300"
                                        >
                                            Clear Search
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}

// Positions Table Component
function PositionsTable({
    positions,
    sortField,
    sortDirection,
    onSort,
    onRowClick
}: {
    positions: UserPosition[];
    sortField: "value" | "change" | "name";
    sortDirection: "asc" | "desc";
    onSort: (field: "value" | "change" | "name") => void;
    onRowClick: (vaultAddress: string) => void;
}) {
    const isMobile = useIsMobile();

    const SortIcon = ({ field }: { field: "value" | "change" | "name" }) => {
        if (sortField !== field) {
            return <ArrowUpDown className="h-4 w-4 text-slate-500" />;
        }
        return sortDirection === "asc" ? (
            <ArrowUp className="h-4 w-4 text-blue-400" />
        ) : (
            <ArrowDown className="h-4 w-4 text-blue-400" />
        );
    };

    if (isMobile) {
        // Mobile: Compact Card View
        return (
            <div className="space-y-3">
                {positions.map((position) => {
                    const changeIsPositive = (position.change24h || 0) >= 0;
                    return (
                        <Card
                            key={position.vault}
                            onClick={() => onRowClick(position.vault)}
                            className="bg-slate-800/50 border-slate-600/30 rounded-lg backdrop-blur-sm hover:bg-slate-800/70 transition-all cursor-pointer"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <img
                                            src={position.depositToken.icon}
                                            alt={position.depositToken.symbol}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{position.vaultName}</p>
                                            <p className="text-xs text-slate-400">{position.depositToken.symbol}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-400" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">Value</p>
                                        <p className="text-base font-bold text-white">${position.value.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 mb-1">24h</p>
                                        <p className={`text-sm font-semibold ${changeIsPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {changeIsPositive ? '+' : ''}{position.change24h?.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    }

    // Desktop: Full Table View
    return (
        <Card className="bg-slate-800/30 border-slate-600/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-900/50 border-b border-slate-700/50">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                <button
                                    onClick={() => onSort("name")}
                                    className="flex items-center gap-2 hover:text-white transition-colors group"
                                >
                                    Vault
                                    <SortIcon field="name" />
                                </button>
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Token
                            </th>
                            <th className="text-right px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                <button
                                    onClick={() => onSort("value")}
                                    className="flex items-center gap-2 ml-auto hover:text-white transition-colors group"
                                >
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Info className="h-3 w-3" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Current position value in USD</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    Position Value
                                    <SortIcon field="value" />
                                </button>
                            </th>
                            <th className="text-right px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                <button
                                    onClick={() => onSort("change")}
                                    className="flex items-center gap-2 ml-auto hover:text-white transition-colors group"
                                >
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Info className="h-3 w-3" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>24-hour price change percentage</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    24h Change
                                    <SortIcon field="change" />
                                </button>
                            </th>
                            <th className="text-right px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Allocation
                            </th>
                            <th className="text-center px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                        {positions.map((position) => {
                            const changeIsPositive = (position.change24h || 0) >= 0;
                            const totalValue = positions.reduce((sum, p) => sum + p.value, 0);
                            const allocation = totalValue > 0 ? (position.value / totalValue * 100).toFixed(1) : "0.0";
                            
                            return (
                                <tr
                                    key={position.vault}
                                    onClick={() => onRowClick(position.vault)}
                                    className="hover:bg-slate-700/30 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={position.depositToken.icon}
                                                alt={position.depositToken.symbol}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                    {position.vaultName}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {position.shares.toLocaleString()} shares
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="secondary" className="bg-slate-700/50 text-slate-200">
                                            {position.depositToken.symbol}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <p className="text-base font-bold text-white">
                                            ${position.value.toFixed(2)}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${
                                            changeIsPositive 
                                                ? 'bg-emerald-500/10 text-emerald-400' 
                                                : 'bg-red-500/10 text-red-400'
                                        }`}>
                                            {changeIsPositive ? (
                                                <ArrowUpRight className="h-3 w-3" />
                                            ) : (
                                                <ArrowDownRight className="h-3 w-3" />
                                            )}
                                            <span className="text-sm font-semibold">
                                                {changeIsPositive ? '+' : ''}{position.change24h?.toFixed(2)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${Math.min(parseFloat(allocation), 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-slate-300 font-medium w-12 text-right">
                                                {allocation}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRowClick(position.vault);
                                            }}
                                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                        >
                                            View
                                            <ExternalLink className="h-3 w-3 ml-1" />
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

// Stat Card Component
function StatCard({ 
    title, 
    value, 
    subValue, 
    icon: Icon, 
    color, 
    isPositive 
}: { 
    title: string; 
    value: string; 
    subValue?: string;
    icon: any; 
    color: string;
    isPositive?: boolean;
}) {
    const isMobile = useIsMobile();
    
    const colorClasses = {
        blue: "from-blue-900/20 to-blue-800/10 border-blue-700/30",
        green: "from-emerald-900/20 to-emerald-800/10 border-emerald-700/30",
        red: "from-red-900/20 to-red-800/10 border-red-700/30",
        purple: "from-purple-900/20 to-purple-800/10 border-purple-700/30",
    };

    const iconColors = {
        blue: "text-blue-400 bg-blue-500/10",
        green: "text-emerald-400 bg-emerald-500/10",
        red: "text-red-400 bg-red-500/10",
        purple: "text-purple-400 bg-purple-500/10",
    };

    return (
        <Card className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} backdrop-blur-sm rounded-xl shadow-lg md:hover:scale-105 transition-transform duration-200`}>
            <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm text-slate-400 mb-1">{title}</p>
                        <p className="text-lg md:text-2xl font-bold text-white truncate">{value}</p>
                        {subValue && (
                            <p className={`text-xs md:text-sm mt-1 font-medium ${
                                isPositive !== undefined 
                                    ? isPositive ? 'text-emerald-400' : 'text-red-400'
                                    : 'text-slate-400'
                            }`}>
                                {subValue}
                            </p>
                        )}
                    </div>
                    {!isMobile && (
                        <div className={`p-2 md:p-3 rounded-lg ${iconColors[color as keyof typeof iconColors]}`}>
                            <Icon className="h-4 w-4 md:h-6 md:w-6" />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Position Card Component
function PositionCard({ 
    position, 
    onClick 
}: { 
    position: UserPosition; 
    onClick: () => void;
}) {
    const changeIsPositive = (position.change24h || 0) >= 0;
    
    return (
        <Card 
            onClick={onClick}
            className="bg-slate-800/50 border-slate-600/30 rounded-xl backdrop-blur-sm hover:bg-slate-800/70 hover:border-blue-500/50 transition-all duration-200 cursor-pointer group"
        >
            <CardContent className="p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img 
                            src={position.depositToken.icon} 
                            alt={position.depositToken.symbol}
                            className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm md:text-base font-semibold text-white truncate">
                                {position.vaultName}
                            </h3>
                            <p className="text-xs text-slate-400">
                                {position.depositToken.symbol}
                            </p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                </div>

                {/* Value */}
                <div className="mb-3">
                    <p className="text-xs text-slate-400 mb-1">Position Value</p>
                    <p className="text-xl md:text-2xl font-bold text-white">
                        ${position.value.toFixed(2)}
                    </p>
                </div>

                {/* 24h Change */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                    <span className="text-xs text-slate-400">24h Change</span>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                        changeIsPositive ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                        {changeIsPositive ? (
                            <ArrowUpRight className="h-4 w-4" />
                        ) : (
                            <ArrowDownRight className="h-4 w-4" />
                        )}
                        {changeIsPositive ? '+' : ''}{position.change24h?.toFixed(2)}%
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Loading State Component
function LoadingState() {
    return (
        <div className="space-y-8">
            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="bg-slate-800/30 border-slate-600/20 rounded-xl">
                        <CardContent className="p-4 md:p-6">
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-8 w-32 mb-2" />
                            <Skeleton className="h-3 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <Card key={i} className="bg-slate-800/30 border-slate-600/20 rounded-xl">
                        <CardContent className="p-6">
                            <Skeleton className="h-6 w-40 mb-4" />
                            <Skeleton className="h-64 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Positions Skeleton */}
            <div>
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="bg-slate-800/30 border-slate-600/20 rounded-xl">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1">
                                        <Skeleton className="h-5 w-32 mb-2" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-24 mb-4" />
                                <Skeleton className="h-4 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Empty State Component
function EmptyState() {
    const router = useRouter();
    
    return (
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm rounded-xl shadow-lg">
            <CardContent className="p-12 text-center">
                <div className="p-4 bg-slate-800/50 rounded-full w-fit mx-auto mb-4">
                    <Wallet className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Positions Yet</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    You don't have any active positions. Start by depositing into a vault to begin your DeFi journey.
                </p>
                <Button
                    onClick={() => router.push('/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Explore Vaults
                </Button>
            </CardContent>
        </Card>
    );
}