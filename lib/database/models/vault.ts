import { Schema, model, models } from 'mongoose';

export interface IVault {
    vaultAddress: string;
    description: string;
}

const vaultSchema = new Schema<IVault>({
    vaultAddress: { type: String, required: true, unique: true },
    description: { type: String, required: true },
}, {
    timestamps: true,
})

const Vault = models.Vault || model<IVault>('Vault', vaultSchema);

export default Vault;