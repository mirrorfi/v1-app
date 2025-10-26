# MirrorFi Database & Activity Tracking

This document explains the database structure and how to track user activities in the MirrorFi V1 app.

## Overview

The system tracks:
1. **Users**: Wallet addresses that connect to the app
2. **Activities**: All transactions and interactions users make (deposits, withdrawals, swaps, etc.)

## Database Schema

### User Model
```typescript
{
  publicAddress: string;      // Wallet address (unique)
  createdAt: Date;            // When user first connected
  lastConnected: Date;        // Last connection time
}
```

### Activity Model
```typescript
{
  wallet: string;             // User's wallet address
  activity: ActivityType;     // Type: 'deposit', 'withdraw', 'swap', etc.
  vault?: string;             // Vault address (optional)
  token?: string;             // Token symbol (e.g., 'SOL', 'USDC')
  amount?: string;            // Amount transacted
  amountInUsd?: string;       // USD value of transaction
  txHash: string;             // Transaction signature (unique)
  timestamp: Date;            // When activity occurred
  metadata?: object;          // Additional data
}
```

**Activity Types:**
- `deposit` - User deposits into a vault
- `withdraw` - User withdraws from a vault
- `swap` - User swaps tokens
- `vault_create` - User creates a new vault
- `strategy_execute` - User executes a strategy
- `strategy_create` - User creates a strategy
- `other` - Other activities

## Usage

### 1. Track User Connection (Automatic)

User registration happens automatically when they connect their wallet. This is already integrated in `app/page.tsx`.

### 2. Log Activities

Use the `logActivity` helper function to track user activities:

```typescript
import { logActivity } from '@/lib/utils/activity-logger';

// Example: Log a deposit
await logActivity({
  wallet: publicKey.toBase58(),
  activity: 'deposit',
  vault: vaultAddress,
  token: 'SOL',
  amount: '0.1',
  amountInUsd: '20.50',
  txHash: signature,
  metadata: {
    // Optional additional data
    strategyName: 'My Strategy',
    note: 'First deposit'
  }
});

// Example: Log a withdrawal
await logActivity({
  wallet: publicKey.toBase58(),
  activity: 'withdraw',
  vault: vaultAddress,
  token: 'USDC',
  amount: '100',
  amountInUsd: '100',
  txHash: signature,
});

// Example: Log a swap
await logActivity({
  wallet: publicKey.toBase58(),
  activity: 'swap',
  token: 'SOL->USDC',
  amount: '1.5',
  amountInUsd: '300',
  txHash: signature,
  metadata: {
    fromToken: 'SOL',
    toToken: 'USDC',
    fromAmount: '1.5',
    toAmount: '300'
  }
});
```

### 3. Get User Activities

```typescript
import { getUserActivities } from '@/lib/utils/activity-logger';

// Fetch user's activity history
const result = await getUserActivities(
  publicKey.toBase58(),
  1,  // page
  20  // limit
);

if (result.success) {
  console.log(result.activities);
  console.log(result.pagination);
}
```

### 4. Get Vault Activities

```typescript
import { getVaultActivities } from '@/lib/utils/activity-logger';

// Fetch all activities for a vault
const result = await getVaultActivities(
  vaultAddress,
  1,  // page
  20  // limit
);

if (result.success) {
  console.log(result.activities);
}
```

### 5. Get Statistics

```typescript
import { getActivityStats } from '@/lib/utils/activity-logger';

// Get overall stats
const stats = await getActivityStats({ days: 30 });

// Get stats for specific wallet
const userStats = await getActivityStats({ 
  wallet: publicKey.toBase58(),
  days: 7 
});

// Get stats for specific vault
const vaultStats = await getActivityStats({ 
  vault: vaultAddress,
  days: 30 
});

if (stats.success) {
  console.log(stats.stats);
  // {
  //   totalActivities: 1234,
  //   activityTypeBreakdown: [
  //     { activity: 'deposit', count: 500 },
  //     { activity: 'withdraw', count: 300 },
  //     ...
  //   ],
  //   totalVolumeUsd: 1500000.50,
  //   uniqueWallets: 450,
  //   uniqueVaults: 25,
  //   periodDays: 30
  // }
}
```

## API Endpoints

### Users
- `POST /api/users/add-user` - Register/update user
- `GET /api/users/get-user?publicAddress=<address>` - Get user info
- `GET /api/users/list?page=1&limit=50` - List all users

### Activities
- `POST /api/activities/log` - Log a new activity
- `GET /api/activities/get-by-wallet?wallet=<address>&page=1&limit=20` - Get user activities
- `GET /api/activities/get-by-vault?vault=<address>&page=1&limit=20` - Get vault activities
- `GET /api/activities/stats?wallet=<address>&vault=<address>&days=30` - Get statistics

## Integration Examples

### In Vault Deposit Component

```typescript
import { logActivity } from '@/lib/utils/activity-logger';

const handleDeposit = async () => {
  try {
    // Execute the deposit transaction
    const signature = await executeDeposit(amount);
    
    // Get USD value
    const usdValue = await getTokenPriceInUSD(token, amount);
    
    // Log the activity
    await logActivity({
      wallet: publicKey.toBase58(),
      activity: 'deposit',
      vault: vaultAddress,
      token: token,
      amount: amount.toString(),
      amountInUsd: usdValue.toString(),
      txHash: signature,
    });
    
    console.log('Deposit successful and logged!');
  } catch (error) {
    console.error('Deposit failed:', error);
  }
};
```

### In Vault Dashboard

```typescript
import { getVaultActivities } from '@/lib/utils/activity-logger';
import { useState, useEffect } from 'react';

function VaultDashboard({ vaultAddress }) {
  const [activities, setActivities] = useState([]);
  
  useEffect(() => {
    async function fetchActivities() {
      const result = await getVaultActivities(vaultAddress, 1, 50);
      if (result.success) {
        setActivities(result.activities);
      }
    }
    
    fetchActivities();
  }, [vaultAddress]);
  
  return (
    <div>
      <h2>Recent Activity</h2>
      {activities.map(activity => (
        <div key={activity._id}>
          {activity.wallet} - {activity.activity} - {activity.amount} {activity.token}
        </div>
      ))}
    </div>
  );
}
```

### In User Profile

```typescript
import { getUserActivities } from '@/lib/utils/activity-logger';
import { useWallet } from '@solana/wallet-adapter-react';

function UserProfile() {
  const { publicKey } = useWallet();
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    if (!publicKey) return;
    
    async function fetchHistory() {
      const result = await getUserActivities(publicKey.toBase58(), 1, 100);
      if (result.success) {
        setHistory(result.activities);
      }
    }
    
    fetchHistory();
  }, [publicKey]);
  
  return (
    <div>
      <h2>Your Transaction History</h2>
      {history.map(activity => (
        <div key={activity._id}>
          {new Date(activity.timestamp).toLocaleDateString()} - 
          {activity.activity} - 
          {activity.amount} {activity.token} 
          ({activity.amountInUsd} USD)
        </div>
      ))}
    </div>
  );
}
```

## Notes

- **Duplicate Prevention**: The system automatically prevents duplicate activity logs based on `txHash`
- **User Auto-Registration**: Users are automatically registered when they connect their wallet
- **Timestamps**: All timestamps are stored in UTC
- **Pagination**: All list endpoints support pagination for performance
- **Indexes**: Database indexes are created for optimal query performance

## Analytics & Insights

The system provides comprehensive data for:
- Total transaction volume (USD)
- Number of active users
- Activity type breakdown
- Vault usage statistics
- User retention metrics
- Daily/weekly/monthly trends

Use the stats endpoint to build dashboards and analytics!
