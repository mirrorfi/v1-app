import { Connection, PublicKey } from '@solana/web3.js';
import { 
    getMultipleObligationData, 
    getMultipleReserveData, 
    getObligationReserves,
    getReserveExchangeRate,
    getCumulativeBorrowRate,
    calculateSupplyAPR,
    calculateBorrowAPR
} from '../accounts';
import { fetchJupiterPrices } from '../../jupiter';
import BigNumber from 'bignumber.js';
import { SYSTEM_PROGRAM_ID } from '@/lib/constants';
import { sfToValue } from '../math';
import { Reserve, BigFractionBytes } from '@kamino-finance/klend-sdk';

interface ObligationNAV {
    obligation: string;
    totalNAV: number;
    deposits: ObligationBalance[];
    borrows: ObligationBalance[];
}

interface ObligationBalance {
    token: string;
    amount: number;
    tokenPrice: number;
    tokenPriceChange24h: number;
    value: number;
    yield: number;
}

export async function getKaminoBalances(connection: Connection, obligationAddresses: PublicKey[]){
    const obligations = await getMultipleObligationData(connection, obligationAddresses);
    if(!obligations || obligations.length === 0){
        return [];
    }

    const reserveAddresses: PublicKey[] = [];
    obligations.forEach(obligation => {
        reserveAddresses.push(...getObligationReserves(obligation));
    });
    const reservesData = await getMultipleReserveData(connection, reserveAddresses);
    const reserves: Record<string, Reserve> = {};
    reservesData.forEach((reserveData, index) => {
        reserves[reserveAddresses[index].toString()] = reserveData;
    });
    // Fetch token prices from Jupiter API
    const tokens = reservesData.map(reserve => reserve.liquidity.mintPubkey.toString());
    const tokenPrices = await fetchJupiterPrices(tokens);
    // Fetch Obligation NAV for each Deposit & Borrow Position
    const obligationBalances: ObligationNAV[] = [];
    obligations.forEach((obligation, index) => {
        const obligationNAV: ObligationNAV = {
            obligation: obligationAddresses[index].toString(),
            totalNAV: 0,
            deposits: [],
            borrows: []
        };
        obligation.deposits.forEach(deposit => {
            if (
                deposit.depositReserve.toString() === SYSTEM_PROGRAM_ID.toString() ||
                deposit.depositedAmount.toNumber() <= 0
            ) return;
            const reserveMint = deposit.depositReserve.toString();
            const reserveExchangeRate = getReserveExchangeRate(reserves[reserveMint]);
            const reserveAPR = calculateSupplyAPR(reserves[reserveMint])
            const tokenMint = reserves[reserveMint].liquidity.mintPubkey.toString();
            const tokenPriceData = tokenPrices[tokenMint];
            // Calculate Position Amount
            const amountRaw = deposit.depositedAmount;
            const depositAmount = new BigNumber(amountRaw.toString())
                .dividedBy(reserveExchangeRate)
                .div(new BigNumber(10).pow(reserves[reserveMint].liquidity.mintDecimals));
            const depositValueUsd = new BigNumber(amountRaw.toString())
                .dividedBy(reserveExchangeRate)
                .multipliedBy(tokenPriceData.usdPrice)
                .div(new BigNumber(10).pow(reserves[reserveMint].liquidity.mintDecimals));
            // Add Position Data
            obligationNAV.deposits.push({
                token               : tokenMint.toString(),
                amount              : depositAmount.toNumber(),
                tokenPrice          : tokenPriceData.usdPrice,
                tokenPriceChange24h : tokenPriceData.priceChange24h,
                value               : depositValueUsd.toNumber(),
                yield               : reserveAPR // Value not reflected in APY
            });
            obligationNAV.totalNAV += depositValueUsd.toNumber();
        });
        obligation.borrows.forEach(borrow => {
            if (borrow.borrowReserve.toString() === SYSTEM_PROGRAM_ID.toString()) return;
            const reserveMint = borrow.borrowReserve.toString();
            const tokenMint = reserves[reserveMint].liquidity.mintPubkey.toString();
            const tokenPriceUSD = tokenPrices[tokenMint].usdPrice;
            const token24Change = tokenPrices[tokenMint].priceChange24h;
            const reserveBorrowAPR = calculateBorrowAPR(reserves[reserveMint]);
            const reserveCumulativeBorrowRate = getCumulativeBorrowRate(
                reserves[reserveMint].liquidity.cumulativeBorrowRateBsf
            );
            const obligationCumulativeBorrowRate = getCumulativeBorrowRate(
                borrow.cumulativeBorrowRateBsf
            );
            // Calculate Borrow Position Amount
            const amountRaw = sfToValue(
                new BigNumber(borrow.borrowedAmountSf.toString())
                .multipliedBy(reserveCumulativeBorrowRate)
                .dividedBy(obligationCumulativeBorrowRate)
            );
            const amount = amountRaw.dividedBy(new BigNumber(10).pow(reserves[reserveMint].liquidity.mintDecimals));
            const borrowValueUsd = amount.multipliedBy(new BigNumber(tokenPriceUSD));
            // Add Borrow Position Data
            obligationNAV.borrows.push({
                token               : tokenMint.toString(),
                amount              : amount.toNumber(),
                tokenPrice          : tokenPriceUSD,
                tokenPriceChange24h : token24Change,
                value               : borrowValueUsd.toNumber(),
                yield               : reserveBorrowAPR
            });
            obligationNAV.totalNAV -= borrowValueUsd.toNumber();
        });
        obligationBalances.push(obligationNAV);
    });

    return obligationBalances;
}