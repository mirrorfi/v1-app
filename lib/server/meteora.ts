import { SERVER_CONNECTION } from "./solana";
import { CpAmm } from "@meteora-ag/cp-amm-sdk";

export const cpAmm = new CpAmm(SERVER_CONNECTION);