import { Schema, model, models } from 'mongoose';

export interface IUser {
  publicAddress: string;
  createdAt: Date;
  lastConnected: Date;
}

const UserSchema = new Schema<IUser>({
  publicAddress: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastConnected: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;
