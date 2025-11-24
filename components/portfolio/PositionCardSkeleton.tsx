import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PositionCardSkeleton() {
    return (
        <div className="space-y-8 mt-12">
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