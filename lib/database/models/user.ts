import { Schema, model, models, Model } from 'mongoose';

export interface IXProfile {
  username: string;
  name: string;
  profileImageUrl: string;
  xId: string;
  connectedAt: Date;
}

export interface IUser {
  publicAddress: string;
  createdAt: Date;
  lastConnected: Date;
  xProfile?: IXProfile;
  customName?: string;
  customProfileImage?: string;
}

const XProfileSchema = new Schema<IXProfile>({
  username: { type: String, required: true },
  name: { type: String, required: true },
  profileImageUrl: { type: String, required: true },
  xId: { type: String, required: true },
  connectedAt: { type: Date, default: Date.now },
}, { _id: false });

const UserSchema = new Schema<IUser>({
  publicAddress: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastConnected: { type: Date, default: Date.now },
  xProfile: { type: XProfileSchema, required: false },
  customName: { type: String, required: false, default: null },
  customProfileImage: { type: String, required: false, default: null },
}, {
  timestamps: true,
  minimize: false, // Don't remove empty objects
  strict: false, // Allow fields not in schema (for migration)
});

// Use existing model if it exists, otherwise create new one
const User: Model<IUser> = models.User || model<IUser>('User', UserSchema);

export default User;
