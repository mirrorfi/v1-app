# Quick Reference: Activity Tracking

## Most Common Use Cases

### 1. Log a Deposit
```typescript
import { logActivity } from '@/lib/utils/activity-logger';

await logActivity({
  wallet: publicKey.toBase58(),
  activity: 'deposit',
  vault: vaultAddress,
  token: 'SOL',
  amount: '0.1',
  amountInUsd: '20.50',
  txHash: signature,
});
```

### 2. Log a Withdrawal
```typescript
await logActivity({
  wallet: publicKey.toBase58(),
  activity: 'withdraw',
  vault: vaultAddress,
  token: 'USDC',
  amount: '100',
  amountInUsd: '100',
  txHash: signature,
});
```

### 3. Log a Swap
```typescript
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
  }
});
```

### 4. Log Vault Creation
```typescript
await logActivity({
  wallet: publicKey.toBase58(),
  activity: 'vault_create',
  vault: newVaultAddress,
  txHash: signature,
  metadata: {
    vaultName: 'My Vault',
    depositToken: 'USDC',
  }
});
```

### 5. Log Strategy Execution
```typescript
await logActivity({
  wallet: publicKey.toBase58(),
  activity: 'strategy_execute',
  vault: vaultAddress,
  txHash: signature,
  metadata: {
    strategyId: 'strategy-123',
    strategyName: 'Yield Maximizer',
  }
});
```

## Get User History (for Profile Page)
```typescript
import { getUserActivities } from '@/lib/utils/activity-logger';

const { activities, pagination } = await getUserActivities(
  publicKey.toBase58(),
  1,  // page
  20  // items per page
);
```

## Get Vault Activity (for Vault Dashboard)
```typescript
import { getVaultActivities } from '@/lib/utils/activity-logger';

const { activities } = await getVaultActivities(vaultAddress, 1, 50);
```

## Get Analytics (for Admin Dashboard)
```typescript
import { getActivityStats } from '@/lib/utils/activity-logger';

const { stats } = await getActivityStats({ days: 30 });
console.log(`Total Volume: $${stats.totalVolumeUsd}`);
console.log(`Active Users: ${stats.uniqueWallets}`);
```

## Environment Variable Required
```env
MONGODB_URI=your_mongodb_connection_string
```

## Activity Types Available
- `deposit`
- `withdraw`
- `swap`
- `vault_create`
- `strategy_execute`
- `strategy_create`
- `other`
