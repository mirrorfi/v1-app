import { Schema, model, models } from 'mongoose';

export type ActivityType = 
  | 'deposit' 
  | 'withdraw' 
  | 'swap' 
  | 'vault_create' 
  | 'strategy_execute'
  | 'strategy_create'
  | 'other';

export interface IActivity {
  wallet: string;
  activity: ActivityType;
  vault?: string;
  token?: string;
  amount?: string;
  amountInUsd?: string;
  txHash: string;
  timestamp: Date;
  metadata?: Record<string, any>; // For additional data
  decimals: number;
}

const ActivitySchema = new Schema<IActivity>({
  wallet: { type: String, required: true, index: true },
  activity: { 
    type: String, 
    required: true,
    enum: ['deposit', 'withdraw', 'swap', 'vault_create', 'strategy_execute', 'strategy_create', 'other']
  },
  vault: { type: String, required: false },
  token: { type: String, required: false },
  amount: { type: String, required: false },
  amountInUsd: { type: String, required: false },
  txHash: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now, index: true },
  metadata: { type: Schema.Types.Mixed, required: false },
  decimals : { type: Number, required: true},
}, {
  timestamps: true,
});

// Compound indexes for common queries
ActivitySchema.index({ wallet: 1, timestamp: -1 });
ActivitySchema.index({ vault: 1, timestamp: -1 });
ActivitySchema.index({ activity: 1, timestamp: -1 });

const Activity = models.Activity || model<IActivity>('Activity', ActivitySchema);

export default Activity;
