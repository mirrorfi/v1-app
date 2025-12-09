type VaultPerformance = {
  apy: number;
  navAPY: { apy: number, label: string }[];
}

type CrtAPY = {
  "1d": number;
  "7d": number;
  "14d": number;
  "30d": number;
}

export async function getCrtAPY(): Promise<CrtAPY> {
  try {
    const res = await fetch('https://api.deficarrot.com/performance?vault=FfCRL34rkJiMiX5emNDrYp3MdWH2mES3FvDQyFppqgpJ&useCache=true');
    const data = await res.json() as VaultPerformance;

    return {
      "1d": data.navAPY[0].apy,
      "7d": data.navAPY[1].apy,
      "14d": data.navAPY[2].apy,
      "30d": data.navAPY[3].apy, 
    }
  } catch (err) {
    throw new Error("Unable to fetch Carrot APY.");
  }
}