import { PublicKey } from "@solana/web3.js";
import { NATIVE_MINT, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SOL_PRICE_UPDATE_V2, USDC_PRICE_UPDATE_V2, USDC_TOKEN_MINT} from "@/lib/constants";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

export interface TokenInfo {
    symbol: string;
    pythOracle: PublicKey | null;
    tokenDecimals: number;
    tokenProgram: PublicKey;
}

export const TOKEN_INFO: Record<string, TokenInfo> = {
    [USDC_TOKEN_MINT.toBase58()]: {
        symbol: 'USDC',
        pythOracle: USDC_PRICE_UPDATE_V2,
        tokenDecimals: 6,
        tokenProgram: TOKEN_PROGRAM_ID,
    },
    [NATIVE_MINT.toBase58()]: {
        symbol: 'SOL',
        pythOracle: SOL_PRICE_UPDATE_V2,
        tokenDecimals: 9,
        tokenProgram: TOKEN_PROGRAM_ID,
    },
    ["CRTx1JouZhzSU6XytsE42UQraoGqiHgxabocVfARTy2s"]: {
        symbol: 'CRT',
        pythOracle: null,
        tokenDecimals: 9,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
    }
};