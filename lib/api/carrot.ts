
export async function getCarrotAPY(): Promise<number | null> {
    try {
        const res = await fetch(`https://api.deficarrot.com//performance?vault=FfCRL34rkJiMiX5emNDrYp3MdWH2mES3FvDQyFppqgpJ&useCache=true`);
        const data = await res.json();

        const oneDayAPY = data.navAPY[0].apy;
        const oneWeekAPY = data.navAPY[1].apy;
        const twoWeekAPY = data.navAPY[2].apy;
        const oneMonthAPY = data.navAPY[3].apy;

        return oneMonthAPY;
    } catch (error) {
        console.error("Fetch Vault Strategies Error:", error);
        return null;
    }
}