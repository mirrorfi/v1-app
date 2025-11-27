import { getCrtAPY } from "./client/carrot";

export async function getStrategyAPY(strategy: any): Promise<number> {

    // Stablecoin: Carrot
    if (strategy.strategyType === "jupiterSwap" && strategy.mint === "CRTx1JouZhzSU6XytsE42UQraoGqiHgxabocVfARTy2s") {
        const apy = (await getCrtAPY())["30d"];
        return apy || 0;
    }
    // TODO: LSTs:


    // TODO: Meteora


    return 0;
}