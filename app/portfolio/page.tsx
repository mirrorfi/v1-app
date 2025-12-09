"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GridStyleBackground } from "@/components/ui/GridStyleBackground";
import { Navbar } from "@/components/Navbar";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { getMultipleVaultBalances, getUserPositions } from "@/lib/api";
import { useEffect, useState, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
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
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
  AreaChart,
} from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PositionCard } from "@/components/portfolio/PositionCard";
import { PositionCardSkeleton } from "@/components/portfolio/PositionCardSkeleton";
import { EmtpyPosition } from "@/components/portfolio/EmptyPosition";
import { StatCard } from "@/components/portfolio/StatCard";
import { ProfileCard } from "@/components/portfolio/ProfileCard";
import Link from "next/link";

export interface UserPosition {
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

export interface UserStats {
    title: string;
    value: string;
    subValue?: string;
    icon: any;
    color: string;
    isPositive?: boolean;
}

interface PortfolioStats {
  totalValue: number;
  totalPnL: number;
  pnlPercentage: number;
  positionsCount: number;
  bestPerformer?: {
    name: string;
    change: number;
    vault: string;
  };
}

const CHART_COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#f97316", // orange
  "#6366f1", // indigo
];

export default function ProfilePage() {
  const isMobile = useIsMobile();
  const { publicKey } = useWallet();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [userPositions, setUserPositions] = useState<UserPosition[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"value" | "change" | "name">(
    "value"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUserPositions = async () => {
    if (!publicKey) return;
    setIsLoading(true);
    setError(null);
    try {
      const userPositionData = await getUserPositions(publicKey.toBase58());
      const userPositions: Record<string, any> = {};
      for (const userPosition of userPositionData) {
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
          value:
            (Number(vaultDepositor.shares) / Number(vaultData.totalShares)) *
            Number(vaultData.totalNav),
          depositToken: {
            symbol: vaultData?.symbol || "UNKNOWN",
            icon: vaultData?.icon || "",
          },
          change24h:
            ((vaultData.publicKey.charCodeAt(0) +
              vaultData.publicKey.charCodeAt(1)) %
              40) -
            20, // Deterministic mock based on vault address
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
    const totalPnL = userPositions.reduce(
      (sum, pos) => sum + (pos.value * (pos.change24h || 0)) / 100,
      0
    );
    const pnlPercentage = totalValue > 0 ? (totalPnL / totalValue) * 100 : 0;

    const bestPerformer = userPositions.reduce((best, pos) => {
      return !best || (pos.change24h || 0) > best.change
        ? { name: pos.vaultName, change: pos.change24h || 0, vault: pos.vault }
        : best;
    }, undefined as { name: string; change: number; vault: string } | undefined);

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
      vault: position.vault,
      percentage:
        portfolioStats.totalValue > 0
          ? ((position.value / portfolioStats.totalValue) * 100).toFixed(1)
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
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
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
      filtered = filtered.filter(
        (pos) =>
          pos.vaultName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pos.depositToken.symbol
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
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
  const PieChartToolTip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      console.log("Payload data:", payload[0]);
      console.log("Full payload:", payload);
      const vaultAddress = payload[0].payload.vault;
      const truncatedVault = vaultAddress.length > 20 
        ? `${vaultAddress.slice(0, 8)}...${vaultAddress.slice(-8)}`
        : vaultAddress;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm text-slate-300 font-medium">
            {payload[0].name}
          </p>
          <p className="text-xs text-slate-400 mb-2">
            {truncatedVault}
          </p>
          <p className="text-lg text-white font-bold">
            ${payload[0].value.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400">
            {payload[0].payload.percentage}%
          </p>
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
              <h3 className="text-xl font-semibold text-white mb-2">
                Connect Your Wallet
              </h3>
              <p className="text-slate-400 mb-6">
                Please connect your wallet to view your portfolio
              </p>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <PositionCardSkeleton />
        ) : userPositions.length === 0 ? (
            <>
            <div className="mb-8">
              <ProfileCard />
            </div>
            <EmtpyPosition />
            </>
        ) : (
          <>
            {/* Profile Card */}
            <div className="mb-8">
              <ProfileCard />
            </div>

            {/* Portfolio Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-12">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="h-full">
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
                    <div className="h-full">
                      <StatCard
                        title="24h P&L"
                        value={`$${portfolioStats.totalPnL.toFixed(2)}`}
                        subValue={`${
                          portfolioStats.pnlPercentage >= 0 ? "+" : ""
                        }${portfolioStats.pnlPercentage.toFixed(2)}%`}
                        icon={
                          portfolioStats.pnlPercentage >= 0
                            ? TrendingUp
                            : TrendingDown
                        }
                        color={
                          portfolioStats.pnlPercentage >= 0 ? "green" : "red"
                        }
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
                    <div className="h-full">
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
                    <Link className="h-full"
                    href = {`/vault/${portfolioStats.bestPerformer?.vault}`}
                    >
                      <StatCard
                        title="Best Performer"
                        value={
                          portfolioStats.bestPerformer?.name.slice(0, 12) ||
                          "N/A"
                        }
                        subValue={
                          portfolioStats.bestPerformer
                            ? `+${portfolioStats.bestPerformer.change.toFixed(
                                2
                              )}%`
                            : ""
                        }
                        icon={ArrowUpRight}
                        color="green"
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{"Your top performing vault"}</p>
                    <p className="text-xs text-slate-200">
                      Click to view vault
                    </p>
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
                  <ResponsiveContainer
                    width="100%"
                    height={isMobile ? 200 : 250}
                  >
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient
                          id="colorValue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                        opacity={0.3}
                      />
                      <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        style={{ fontSize: isMobile ? "10px" : "12px" }}
                      />
                      <YAxis
                        stroke="#64748b"
                        style={{ fontSize: isMobile ? "10px" : "12px" }}
                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                        }}
                        formatter={(value: any) => [
                          `$${value.toFixed(2)}`,
                          "Value",
                        ]}
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
                  <ResponsiveContainer
                    width="100%"
                    height={isMobile ? 200 : 250}
                  >
                    <RechartsPieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 40 : 60}
                        outerRadius={isMobile ? 70 : 90}
                        paddingAngle={2}
                        dataKey="value"
                        onClick={(data) => {
                          if (data && data.vault) {
                            router.push(`/vault/${data.vault}`);
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<PieChartToolTip />} />
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
                      <h3 className="text-red-400 font-semibold text-lg mb-2">
                        Error Loading Positions
                      </h3>
                      <p className="text-red-300 mb-4">{error}</p>
                      <Button
                        onClick={handleRefresh}
                        variant="outline"
                        size="sm"
                        disabled={isRefreshing}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <RefreshCw
                          className={`h-4 w-4 mr-2 ${
                            isRefreshing ? "animate-spin" : ""
                          }`}
                        />
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
                  <Badge
                    variant="secondary"
                    className="bg-slate-700/50 text-slate-300"
                  >
                    {filteredAndSortedPositions.length}{" "}
                    {filteredAndSortedPositions.length === 1
                      ? "Position"
                      : "Positions"}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Toggle */}
                  <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-600/30">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("table")}
                      className={`h-8 w-8 p-0 ${
                        viewMode === "table"
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`h-8 w-8 p-0 ${
                        viewMode === "grid"
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
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
                          <RefreshCw
                            className={`h-4 w-4 ${
                              isRefreshing ? "animate-spin" : ""
                            }`}
                          />
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
            </div>
          </>
        )}
      </div>
    </main>
  );
}

// Positions Table Component
function PositionsTable({
  positions,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
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
                      <p className="text-sm font-semibold text-white truncate">
                        {position.vaultName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {position.depositToken.symbol}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Value</p>
                    <p className="text-base font-bold text-white">
                      ${position.value.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">24h</p>
                    <p
                      className={`text-sm font-semibold ${
                        changeIsPositive ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {changeIsPositive ? "+" : ""}
                      {position.change24h?.toFixed(2)}%
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
              const allocation =
                totalValue > 0
                  ? ((position.value / totalValue) * 100).toFixed(1)
                  : "0.0";

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
                    <Badge
                      variant="secondary"
                      className="bg-slate-700/50 text-slate-200"
                    >
                      {position.depositToken.symbol}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <p className="text-base font-bold text-white">
                      ${position.value.toFixed(2)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${
                        changeIsPositive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {changeIsPositive ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      <span className="text-sm font-semibold">
                        {changeIsPositive ? "+" : ""}
                        {position.change24h?.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${Math.min(parseFloat(allocation), 100)}%`,
                          }}
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
