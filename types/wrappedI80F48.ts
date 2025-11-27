// lifted from @mrgnlabs/mrgn-common
// not imported because package only runs on server-side Node.js

import Decimal from "decimal.js";
import BigNumber from "bignumber.js";

const I80F48_FRACTIONAL_BYTES = 6;
const I80F48_TOTAL_BYTES = 16;
const I80F48_DIVISOR = new Decimal(2).pow(8 * I80F48_FRACTIONAL_BYTES);

interface WrappedI80F48 {
  value: number[];
}

export function wrappedI80F48toBigNumber(wrapped: WrappedI80F48): BigNumber {
  let bytesLE = wrapped.value;
  if (bytesLE.length !== I80F48_TOTAL_BYTES) {
    throw new Error(`Expected a ${I80F48_TOTAL_BYTES}-byte buffer`);
  }

  let bytesBE = bytesLE.slice();
  bytesBE.reverse();

  let signChar = "";
  const msb = bytesBE[0];
  if (msb & 0x80) {
    signChar = "-";
    bytesBE = bytesBE.map((v) => ~v & 0xff);
  }

  let hex = signChar + "0x" + bytesBE.map((v) => v.toString(16).padStart(2, "0")).join("");
  let decoded = new Decimal(hex).dividedBy(I80F48_DIVISOR);

  return new BigNumber(decoded.toString());
}