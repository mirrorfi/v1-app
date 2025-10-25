# MirrorFi Database & Activity Tracking Implementation Summary

## ✅ What Was Implemented

### 1. Database Infrastructure

#### Database Connection (`lib/database/index.ts`)
- MongoDB connection setup with caching
- Database name: `mirrorfi_v1`
- Automatic reconnection handling

#### User Model (`lib/database/models/user.ts`)
```typescript
{
  publicAddress: string;    // Unique wallet address
  createdAt: Date;         // First connection timestamp
  lastConnected: Date;     // Most recent connection
}
```

#### Activity Model (`lib/database/models/activity.ts`)
```typescript
{
  wallet: string;          // User wallet address
  activity: ActivityType;  // deposit, withdraw, swap, etc.
  vault?: string;         // Optional vault address
  token?: string;         // Optional token symbol
  amount?: string;        // Optional amount
  amountInUsd?: string;   // Optional USD value
  txHash: string;         // Transaction signature (unique)
  timestamp: Date;        // Activity timestamp
  metadata?: object;      // Additional flexible data
}
```

**Supported Activity Types:**
- `deposit` - Vault deposits
- `withdraw` - Vault withdrawals
- `swap` - Token swaps
- `vault_create` - New vault creation
- `strategy_execute` - Strategy execution
- `strategy_create` - Strategy creation
- `other` - Other activities

**Database Indexes:**
- Single indexes on: wallet, timestamp, activity
- Compound indexes for performance:
  - `{ wallet: 1, timestamp: -1 }`
  - `{ vault: 1, timestamp: -1 }`
  - `{ activity: 1, timestamp: -1 }`
- Unique index on `txHash` (prevents duplicates)

---

### 2. API Endpoints

#### User Management APIs

**POST `/api/users/add-user`**
- Creates new user or updates last connection time
- Automatically called when wallet connects
- Body: `{ publicAddress: string }`
- Returns: `{ success, user, isNewUser }`

**GET `/api/users/get-user?publicAddress=<address>`**
- Retrieves user information
- Returns: `{ success, user: { publicAddress, createdAt, lastConnected } }`

**GET `/api/users/list?page=1&limit=50`**
- Lists all users with pagination
- Sorted by last connection (most recent first)
- Returns: `{ success, users, pagination }`

#### Activity Tracking APIs

**POST `/api/activities/log`**
- Logs a new user activity
- Prevents duplicate entries by txHash
- Body: `LogActivityParams`
- Returns: `{ success, activity, isDuplicate }`

**GET `/api/activities/get-by-wallet?wallet=<address>&page=1&limit=20`**
- Retrieves activities for a specific wallet
- Sorted by timestamp (most recent first)
- Returns: `{ success, activities, pagination }`

**GET `/api/activities/get-by-vault?vault=<address>&page=1&limit=20`**
- Retrieves activities for a specific vault
- Sorted by timestamp (most recent first)
- Returns: `{ success, activities, pagination }`

**GET `/api/activities/stats?wallet=<address>&vault=<address>&days=30`**
- Returns aggregated statistics
- All query params are optional
- Response includes:
  - `totalActivities` - Total activity count
  - `activityTypeBreakdown` - Count by activity type
  - `totalVolumeUsd` - Total transaction volume in USD
  - `uniqueWallets` - Number of unique wallets
  - `uniqueVaults` - Number of unique vaults
  - `periodDays` - Time period analyzed

---

### 3. Helper Functions (`lib/utils/activity-logger.ts`)

**`logActivity(params: LogActivityParams)`**
- Main function to log user activities
- Returns: `{ success, error?, isDuplicate? }`
- Usage:
  ```typescript
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

**`registerUser(publicAddress: string)`**
- Registers or updates user connection
- Returns: `{ success, isNewUser?, error? }`
- Automatically called in `app/page.tsx`

**`getUserActivities(wallet: string, page?: number, limit?: number)`**
- Fetches user's activity history
- Returns: `{ success, activities?, pagination?, error? }`

**`getVaultActivities(vault: string, page?: number, limit?: number)`**
- Fetches vault's activity history
- Returns: `{ success, activities?, pagination?, error? }`

**`getActivityStats(params?: { wallet?, vault?, days? })`**
- Fetches aggregated statistics
- Returns: `{ success, stats?, error? }`

---

### 4. TypeScript Types (`types/activity.ts`)

Complete type definitions for:
- `ActivityType` - Union type of all activity types
- `Activity` - Activity document interface
- `User` - User document interface
- `ActivityStats` - Statistics interface
- `Pagination` - Pagination metadata
- `LogActivityParams` - Parameters for logging activities
- All response types for type safety

---

### 5. Integration

**Automatic User Registration (`app/page.tsx`)**
- When user connects wallet and signs terms
- Automatically calls `registerUser()`
- Updates last connection timestamp

---

### 6. Documentation

**`DATABASE_USAGE.md`**
- Comprehensive guide to database structure
- API endpoint documentation
- Integration examples for common scenarios
- Analytics and insights information

**`ACTIVITY_TRACKING_QUICK_REF.md`**
- Quick reference for common operations
- Copy-paste examples for each activity type
- Environment setup instructions

---

## 🔧 Required Setup

### Environment Variable
Add to `.env.local`:
```env
MONGODB_URI=your_mongodb_connection_string
```

### Dependencies
- ✅ `mongoose` - Already installed via npm

---

## 📊 Use Cases

### Track Every Transaction
```typescript
// After any successful transaction
await logActivity({
  wallet: publicKey.toBase58(),
  activity: 'deposit',
  vault: vaultAddress,
  token: 'SOL',
  amount: amount.toString(),
  amountInUsd: usdValue.toString(),
  txHash: signature,
});
```

### Display User History
```typescript
const { activities } = await getUserActivities(wallet, 1, 50);
// Show in profile page
```

### Display Vault Activity
```typescript
const { activities } = await getVaultActivities(vault, 1, 100);
// Show in vault dashboard
```

### Analytics Dashboard
```typescript
const { stats } = await getActivityStats({ days: 30 });
// Display:
// - Total volume: stats.totalVolumeUsd
// - Active users: stats.uniqueWallets
// - Activity breakdown: stats.activityTypeBreakdown
```

---

## 🎯 Benefits

1. **Complete Transaction History** - Track every user action
2. **User Insights** - Understand user behavior and retention
3. **Volume Metrics** - Calculate total platform volume
4. **Vault Analytics** - Per-vault usage statistics
5. **Duplicate Prevention** - Automatic deduplication by txHash
6. **Type Safety** - Full TypeScript support
7. **Scalable** - Indexed queries for performance
8. **Flexible** - Metadata field for custom data

---

## 📝 Notes

- All timestamps stored in UTC
- Pagination on all list endpoints
- Automatic duplicate prevention
- User auto-registration on wallet connect
- Compound indexes for optimal performance
- Can handle millions of records efficiently

---

## 🚀 Next Steps

1. Add MongoDB URI to `.env.local`
2. Test database connection
3. Start logging activities in transaction handlers
4. Build user profile page with activity history
5. Create admin analytics dashboard
6. Set up monitoring and alerts

---

## 📞 Support

For questions or issues:
- Check `DATABASE_USAGE.md` for detailed docs
- Check `ACTIVITY_TRACKING_QUICK_REF.md` for quick examples
- Review API endpoint responses for error messages
