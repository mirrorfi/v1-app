import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { UserStats } from "@/app/portfolio/page";

export function StatCard({
  color, title, value, subValue, icon: Icon, isPositive
}: UserStats) {
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
    <Card
      className={`h-full bg-linear-to-br ${
        colorClasses[color as keyof typeof colorClasses]
      } backdrop-blur-sm rounded-xl shadow-lg md:hover:scale-105 transition-transform duration-200`}
    >
      <CardContent className="p-4 md:p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3 flex-1">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-slate-400 mb-1">{title}</p>
            <p className="text-lg md:text-2xl font-bold text-white truncate">
              {value}
            </p>
            <div className="h-5 md:h-6 mt-1">
              {subValue && (
                <p
                  className={`text-xs md:text-sm font-medium ${
                    isPositive !== undefined
                      ? isPositive
                        ? "text-emerald-400"
                        : "text-red-400"
                      : "text-slate-400"
                  }`}
                >
                  {subValue}
                </p>
              )}
            </div>
          </div>
          {!isMobile && (
            <div
              className={`p-2 md:p-3 rounded-lg ${
                iconColors[color as keyof typeof iconColors]
              }`}
            >
              <Icon className="h-4 w-4 md:h-6 md:w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}