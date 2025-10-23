import { PublicKey } from "@solana/web3.js";
import { NATIVE_MINT, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SOL_PRICE_UPDATE_V2, USDC_PRICE_UPDATE_V2, USDC_TOKEN_MINT,TOKEN_PROGRAM_2022_ID} from "@/lib/constants";

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
        tokenProgram: TOKEN_PROGRAM_2022_ID,
    }
};