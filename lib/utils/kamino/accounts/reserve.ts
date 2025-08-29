import { Reserve, BigFractionBytes, CurvePoint } from '@kamino-finance/klend-sdk'
import { PublicKey, Connection } from '@solana/web3.js';
import { truncateBorrowCurve, getBorrowRate } from '../math';
import Decimal from 'decimal.js';
import BigNumber from 'bignumber.js';


export async function getReserveData(connection: Connection, reserveAddress: PublicKey): Promise<Reserve> {
    const res = await connection.getAccountInfo(reserveAddress);
    const accData = res?.data;
    if (!accData) {
        throw new Error("No Reserve Data found");
    }
    const data = Reserve.decode(accData);
    return data;
}

export async function getMultipleReserveData(connection: Connection, reserveAddresses: PublicKey[]): Promise<Reserve[]> {
    const res = await connection.getMultipleAccountsInfo(reserveAddresses);
    const reserves: Reserve[] = [];
    for (const account of res) {
        const accData = account?.data;
        if (!accData) {
            throw new Error("No Reserve Data found");
        }
        reserves.push(Reserve.decode(accData));
    }
    return reserves;
}

// Reference Sonar Watch (Jupiter Portfolio) Open Source Kamino Tracker:
export function getReserveExchangeRate(reserve: Reserve): number {
  const INITIAL_COLLATERAL_RATE = 1;

  const totalSupply = new BigNumber( getReserveLiquiditySupply(reserve.liquidity).toString());
  const mintTotalSupply = new BigNumber(reserve.collateral.mintTotalSupply.toString());
  if (mintTotalSupply.isZero() || totalSupply.isZero()) {
    return INITIAL_COLLATERAL_RATE;
  }
  return new BigNumber(mintTotalSupply.toString())
    .dividedBy(totalSupply).toNumber();
}

export function calculateSupplyAPR(reserve: Reserve) {
  const currentUtilization = calculateUtilizationRatio(reserve.liquidity);
  const borrowAPR = calculateBorrowAPR(reserve);
  return currentUtilization * borrowAPR;
}

export function calculateBorrowAPR(reserve: Reserve) {
  const currentUtilization = calculateUtilizationRatio(reserve.liquidity);
  const curve = truncateBorrowCurve(reserve.config.borrowRateCurve.points);
  return getBorrowRate(currentUtilization, curve);
}

export function getCumulativeBorrowRate(borrowRatesSf: BigFractionBytes) {
  return [
    BigNumber(borrowRatesSf.value[0].toString()),
    BigNumber(borrowRatesSf.value[1].toString()),
    BigNumber(borrowRatesSf.value[2].toString()),
    BigNumber(borrowRatesSf.value[3].toString()),
  ].reduce(
    (prev, curr, i) => prev.plus(curr.shiftedBy(-i * 64)),
    new BigNumber(0)
  );
}

// Reserve Calculations

function calculateUtilizationRatio(liquidity: Reserve["liquidity"]) {
  const totalBorrows = getBorrowedAmount(liquidity);
  const totalSupply = getReserveLiquiditySupply(liquidity);
  if (totalSupply.eq(0)) {
    return 0;
  }
  return totalBorrows.dividedBy(totalSupply).toNumber();
}

function getReserveLiquiditySupply(liquidity: Reserve["liquidity"]): Decimal {
  return getLiquidityAvailableAmount(liquidity)
    .add(getBorrowedAmount(liquidity))
    .sub(getAccumulatedProtocolFees(liquidity))
    .sub(getAccumulatedReferrerFees(liquidity))
    .sub(getPendingReferrerFees(liquidity));
}

function getBorrowedAmount(liquidity: Reserve["liquidity"]): Decimal {
  return new Decimal(
    new BigNumber(liquidity.borrowedAmountSf.toString()).dividedBy(2 ** 60).toString()
  );
}

function getLiquidityAvailableAmount(liquidity: Reserve["liquidity"]): Decimal {
  return new Decimal(
    new BigNumber(liquidity.availableAmount.toString()).toString()
  );
}

function getAccumulatedProtocolFees(liquidity: Reserve["liquidity"]): Decimal {
  return new Decimal(
    new BigNumber(liquidity.accumulatedProtocolFeesSf.toString()).dividedBy(2 ** 60).toString()
  );
}

function getAccumulatedReferrerFees(liquidity: Reserve["liquidity"]): Decimal {
  return new Decimal(
    new BigNumber(liquidity.accumulatedReferrerFeesSf.toString()).dividedBy(2 ** 60).toString()
  );
}

function getPendingReferrerFees(liquidity: Reserve["liquidity"]): Decimal {
  return new Decimal(
    new BigNumber(liquidity.pendingReferrerFeesSf.toString()).dividedBy(2 ** 60).toString()
  );
}