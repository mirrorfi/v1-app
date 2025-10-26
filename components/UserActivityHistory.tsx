"use client";

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUserActivities } from '@/lib/utils/activity-logger';
import { Activity } from '@/types/activity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowDownCircle, ArrowUpCircle, RefreshCcw, Plus } from 'lucide-react';

/**
 * Example component showing how to display user activity history
 * Can be used in a profile page or user dashboard
 */
export function UserActivityHistory() {
  const { publicKey } = useWallet();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setActivities([]);
      setLoading(false);
      return;
    }

    fetchActivities();
  }, [publicKey, page]);

  const fetchActivities = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    const result = await getUserActivities(publicKey.toBase58(), page, 20);
    
    if (result.success && result.activities) {
      setActivities(result.activities);
      setHasMore(result.pagination ? result.pagination.page < result.pagination.totalPages : false);
    }
    
    setLoading(false);
  };

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'deposit':
        return <ArrowDownCircle className="h-5 w-5 text-green-500" />;
      case 'withdraw':
        return <ArrowUpCircle className="h-5 w-5 text-red-500" />;
      case 'swap':
        return <RefreshCcw className="h-5 w-5 text-blue-500" />;
      case 'vault_create':
      case 'strategy_create':
        return <Plus className="h-5 w-5 text-purple-500" />;
      default:
        return <RefreshCcw className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'deposit':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'withdraw':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'swap':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'vault_create':
      case 'strategy_create':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!publicKey) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">Connect your wallet to view activity history</p>
        </CardContent>
      </Card>
    );
  }

  if (loading && activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">No activity found</p>
          <p className="text-sm text-muted-foreground mt-2">Start using MirrorFi to see your transaction history here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-shrink-0">
                {getActivityIcon(activity.activity)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getActivityColor(activity.activity)}>
                    {activity.activity.replace('_', ' ')}
                  </Badge>
                  {activity.token && (
                    <span className="text-sm font-medium">{activity.token}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatDate(activity.timestamp)}</span>
                  {activity.vault && (
                    <>
                      <span>•</span>
                      <span>Vault: {truncateAddress(activity.vault)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              {activity.amount && (
                <div className="font-medium">
                  {activity.amount} {activity.token}
                </div>
              )}
              {activity.amountInUsd && (
                <div className="text-sm text-muted-foreground">
                  ${parseFloat(activity.amountInUsd).toFixed(2)}
                </div>
              )}
              <a
                href={`https://solscan.io/tx/${activity.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline mt-1 inline-block"
              >
                View Tx
              </a>
            </div>
          </div>
        ))}

        {hasMore && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
