import {MeteoraDAMMV2PoolData} from "@/types/api"

export async function getDAMMV2PoolInfo(pool: string) {

    const url = "https://dammv2-api.meteora.ag/pools/" + pool;

    const res = await fetch(url);

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Unable to fetch pool info from Meteora API.');
    }

    const poolData: MeteoraDAMMV2PoolData = data.data
    if (!poolData) {
        throw new Error("Pool not found!")
    }
    return poolData;
}

export async function getDAMMV2PoolsByMints(mintA: string, mintB:string) {
    const url = new URL("https://dammv2-api.meteora.ag/pools");
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
    if (!poolData || poolData.length == 0) {
        return [];
    }
    return poolData;
}