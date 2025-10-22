import { PublicKey, SystemProgram } from "@solana/web3.js";
import { NATIVE_MINT } from "@solana/spl-token";

export const SYSTEM_PROGRAM_ID = SystemProgram.programId;
export const SYSVAR_INSTRUCTION_ADDRESS = new PublicKey("Sysvar1nstructions1111111111111111111111111");
export const KAMINO_PROGRAM_ID = new PublicKey("KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD");
export const KAMINO_FARMS_PROGRAM_ID = new PublicKey("FarmsPZpWu9i7Kky8tPN37rs2TpmMrAZrC7S7vJa91Hr");

export const KAMINO_SCOPE_PRICES = new PublicKey("3NJYftD5sjVfxSnUdZ1wVML8f3aC6mp1CXCL6L7TnU8C");
export const KAMINO_MAIN_MARKET = new PublicKey("7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF");
export const KAMINO_SANCTUM_MARKET = new PublicKey("eNLm5e5KVDX2vEcCkt75PpZ2GMfXcZES3QrFshgpVzp");
export const KAMINO_MARINADE_MARKET = new PublicKey("GVDUXFwS8uvBG35RjZv6Y8S1AkV5uASiMJ9qTUKqb5PL");

export const KAMINO_FARM_DELEGATEE = new PublicKey("Vnaq7vbHuwHHHSTzDYVnMf2WzFPdAzQA1iAa5NtpXNw");

// Tokens
export const USDC_TOKEN_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
export const SOL_TOKEN_MINT = NATIVE_MINT;

// Pyth PriceUpdateV2
export const USDC_PRICE_UPDATE_V2 = new PublicKey("Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX");
export const SOL_PRICE_UPDATE_V2 = new PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE");

// TEMP
export const DEFAULT_KAMINO_REFERER_METADATA = new PublicKey("9wEzLSxpBf41YWG7zM4etDZuc2XUh9gGuUQh5K9SFsVk");

export const DISCRIMINATOR_SIZE = 8;

// export const MAIN_MARKET: Address = address('7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF');
// export const MAIN_MARKET_LUT: Address = address('284iwGtA9X9aLy3KsyV8uT2pXLARhYbiSi5SiM2g47M2');
// export const JLP_MARKET: Address = address('DxXdAyU3kCjnyggvHmY5nAwg5cRbbmdyX3npfDMjjMek');
// export const JLP_MARKET_LUT: Address = address('GprZNyWk67655JhX6Rq9KoebQ6WkQYRhATWzkx2P2LNc');

// export const PYUSD_RESERVE: Address = address('2gc9Dm1eB6UgVYFBUN9bWks6Kes9PbWSaPaa9DqyvEiN');
// export const PYUSD_MINT: Address = address('2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo');
// export const USDC_RESERVE_JLP_MARKET: Address = address('Ga4rZytCpq1unD4DbEJ5bkHeUz9g3oh9AAFEi6vSauXp');
// export const USDC_MINT: Address = address('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
// export const JUPSOL_RESERVE: Address = address('d4A2prbA2whesmvHaL88BH6Ewn5N4bTSU2Ze8P6Bc4Q');
// export const JUPSOL_MINT: Address = address('jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v');
// export const SOL_RESERVE: Address = address('d4A2prbA2whesmvHaL88BH6Ewn5N4bTSU2Ze8P6Bc4Q');
// export const JLP_RESERVE_JLP_MARKET: Address = address('DdTmCCjv7zHRD1hJv3E8bpnSEQBzdKkzB1j9ApXX5QoP');
// export const JLP_MINT: Address = address('27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4');
