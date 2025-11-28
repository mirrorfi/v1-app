import { MeteoraDAMMV2PoolData } from "@/types/meteora"

const METEORA_API_URL = "https://dammv2-api.meteora.ag";

export async function getDAMMV2PoolInfo(pool: string) {
    const url = `${METEORA_API_URL}/pools/` + pool;

    const res = await fetch(url);

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Unable to fetch pool info from Meteora API.');
    }

    const poolData: MeteoraDAMMV2PoolData = data.data;

    if (!poolData) {
        throw new Error("Pool not found!")
    }

    return poolData;
}

export async function getDAMMV2PoolsByMints(mintA: string, mintB: string) {
    const url = new URL(`${METEORA_API_URL}/pools`);
    url.searchParams.append("token_a_mint", mintA);
    url.searchParams.append("token_b_mint", mintB);
    url.searchParams.append("order", "desc");

    const res = await fetch(url);

    const data = await res.json();
    console.log("DAMM V2 Pool:", data);

    if (!res.ok) {
        throw new Error(data.error || 'Unable to fetch pool info from Meteora API.');
    }

    const poolData: MeteoraDAMMV2PoolData[] = data.data

    if (poolData?.length == 0) {
        return [];
    }
    
    return poolData;
}