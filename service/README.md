# Vault Indexer Service

A dedicated Node.js service that runs 24/7 to continuously fetch vault balance data from MirrorFi vaults and store historical snapshots in a MongoDB time-series database.

## Overview

This service acts as a background worker that:
- Fetches real-time vault balance and NAV data from MirrorFi vaults
- Stores historical vault snapshots in MongoDB time-series collections

## Architecture

```
┌─────────────────┐    Vault Balance     ┌─────────────────┐
│                 │ ──────────────────>  │                 │
│  Vault Indexer  │    API Requests      │   MirrorFi API  │
│   Service       │ <────────────────── │   (Future)      │
│   (Node.js)     │    Vault Data        │                 │
└─────────────────┘                      └─────────────────┘
         │                                        │
         │ Store Time-Series Data                │
         ▼                                        │
┌─────────────────┐                              │
│   MongoDB       │                              │
│   Time-Series   │ <────────────────────────────┘
│   Collections   │    Historical Vault Data
│                 │
└─────────────────┘
```


## Configuration

### Environment Variables
```bash
MONGODB_URI=mongodb://localhost:27017/mirrorfi
MONGODB_DB_NAME=mirrorfi
MONGODB_COLLECTION=vault_snapshots
MIRRORFI_API_URL=https://api.mirrorfi.com  # Future API endpoint
```

### Config File (`config.json`)
```json
{
  "FETCH_INTERVAL": 60000,        // 1 minute between fetches
  "LOG_FILE_NAME": "vault-indexer.log"
}
```


### TODO:
- Deploy onto railway
- updating api endpoint to support batch fetching


