import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "../../constants";

export interface TokenInfo {
    symbol: string;
    pythOracle: PublicKey;
    tokenDecimals: number;
    tokenProgram: PublicKey;
}

export const TOKEN_INFO: Record<string, TokenInfo> = {
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
        symbol: 'USDC',
        pythOracle: new PublicKey('Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX'),
        tokenDecimals: 6,
        tokenProgram: TOKEN_PROGRAM_ID,
    },
    'So11111111111111111111111111111111111111112': {
        symbol: 'SOL',
        pythOracle: new PublicKey('7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE'),
        tokenDecimals: 9,
        tokenProgram: TOKEN_PROGRAM_ID,
    },
};