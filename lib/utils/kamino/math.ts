import BigNumber from 'bignumber.js';
import { Reserve, BigFractionBytes, CurvePoint } from '@kamino-finance/klend-sdk'

const FRACTIONS = 60;
const MULTIPLIER_NUMBER = 2 ** FRACTIONS;

export function sfToValue(sf: BigNumber) {
  return sf.dividedBy(MULTIPLIER_NUMBER);
}

export function valueToSf(value: BigNumber) {
  return value.multipliedBy(MULTIPLIER_NUMBER);
}

export const interpolate = (
  x: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number
) => {
  if (x > x1) {
    throw Error("Cannot do extrapolation");
  }
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
};

export const truncateBorrowCurve = (points: CurvePoint[]): [number, number][] => {
  const curve: [number, number][] = [];
  for (const { utilizationRateBps, borrowRateBps } of points) {
    curve.push([utilizationRateBps / 10_000, borrowRateBps / 10_000]);
    if (utilizationRateBps === 10_000) {
      break;
    }
  }
  return curve;
};

export const getBorrowRate = (
  currentUtilization: number,
  curve: [number, number][]
): number => {
  let [x0, y0, x1, y1] = [0, 0, 0, 0];

  if (curve.length < 2) {
    throw Error("Invalid borrow rate curve, only one point");
  }

  if (currentUtilization > 1) {
    // eslint-disable-next-line no-param-reassign
    currentUtilization = 1;
  }

  for (let i = 1; i < curve.length; i++) {
    const [pointUtilization, pointRate] = curve[i];
    if (pointUtilization === currentUtilization) {
      return pointRate;
    }

    if (currentUtilization <= pointUtilization) {
      [x0, y0] = curve[i - 1];
      [x1, y1] = curve[i];
      break;
    }
  }
  if (x0 === 0 && y0 === 0 && x1 === 0 && y1 === 0) {
    throw Error("Invalid borrow rate curve, could not identify the interpolation points.");
  }
  if (x0 >= x1 || y0 > y1) {
    throw Error("Invalid borrow rate curve, curve is not uniformly increasing");
  }
  return interpolate(currentUtilization, x0, x1, y0, y1);
};
