import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { TokenAccountStruct, MintAccountStruct } from '../struct';
import { fetchJupiterPrices } from '../jupiter';
import BigNumber from 'bignumber.js';

interface SpotData {
    totalNAV: number;
    tokens: TokenBalance[];
}

interface TokenBalance {
    token: string;
    amount: number;
    tokenPrice: number;
    tokenPriceChange24h: number;
    value: number;
}

export async function getSpotBalances(connection: Connection, owner: PublicKey, mintAddresses: PublicKey[]) : Promise<SpotData> {
    // Given the list of token mint, fetch token info to get its decimals
    const mintInfos = await connection.getMultipleAccountsInfo(mintAddresses);
    const mintDecimals: Record<string, number> = {};
    mintInfos.forEach((mintInfo, index) => {
        if (mintInfo) {
            const mintData = mintInfo.data;
            const mintAccount = MintAccountStruct.decode(new Uint8Array(mintData));
            mintDecimals[mintAddresses[index].toString()] = mintAccount.decimals;
        }
    });
    // Fetch Token Prices
    const tokenPrices = await fetchJupiterPrices(mintAddresses.map(mint => mint.toString()));
    const tokenAtas = mintAddresses.map(mint => getAssociatedTokenAddressSync(mint, owner));
    // Fetch Token Account Data
    const accountInfos = await connection.getMultipleAccountsInfo(tokenAtas);

    const spotData: SpotData = {
        totalNAV: 0,
        tokens: []
    };
    accountInfos.forEach((accountInfo, index) => {
        const tokenMint = mintAddresses[index];
        const tokenDecimal = mintDecimals[tokenMint.toString()];
        const tokenPriceData = tokenPrices[tokenMint.toString()];
        if(!tokenDecimal || !tokenPriceData) {
            throw new Error("Token not found");
        }

        if(accountInfo && accountInfo.data) {
            const tokenAccount = TokenAccountStruct.decode(new Uint8Array(accountInfo.data));
            const tokenAmount =  Number(new BigNumber(
                tokenAccount.amount.toString()).dividedBy(new BigNumber(10).pow(tokenDecimal)
            ));
            const tokenValueUSD = tokenAmount * tokenPriceData.usdPrice;
            spotData.totalNAV += tokenValueUSD;
            spotData.tokens.push({
                token: tokenMint.toString(),
                amount: tokenAmount,
                tokenPrice: tokenPriceData.usdPrice,
                tokenPriceChange24h: tokenPriceData.priceChange24h,
                value: tokenValueUSD,
            });
        } else {
            spotData.tokens.push({
                token: tokenMint.toString(),
                amount: 0,
                tokenPrice: tokenPriceData.usdPrice,
                tokenPriceChange24h: tokenPriceData.priceChange24h,
                value: 0,
            });
        }
    });
    return spotData;
}