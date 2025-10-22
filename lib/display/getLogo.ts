

export function getLogoName(label: string) {
    if (label.slice(0, 6) === "Kamino") {
        return "kamino";
    }
    return label.toLowerCase();
}

export function getLogoNameByAddress(address: string) {
    const addressToNameMap: Record<string, string> = {
        "So11111111111111111111111111111111111111112": "SOL",
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "USDC",
        "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": "USDT",
        "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo": "PYUSD",
        "9zNQRsGLjNKwCUU5Gq5LR8beUCPzQMVMqKAi3SSZh54u": "FDUSD",
        "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA": "USDS",
        "jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v": "JupSOL",
        "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn": "JitoSOL",
        "BNso1VUJnh4zcfpZa6986Ea66P6TCp59hvtNJ8b1X85": "BNSOL",
        "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": "mSOL",
        "Bybit2vBJGhPF52GBdNaQfUJ6ZpThSgHBobjWZpLPb4B": "bbSOL",
        "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh": "wBTC",
        "zBTCug3er3tLyffELcvDNrKkCymbPWysGcWihESYfLg": "zBTC",
        "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm": "INF",
        "vSoLxydx6akxyMD9XEcPvGYNGq6Nn66oqVb3UkGkei7": "vSOL",
        "Dso1bDeDjCQxTrWHqUUi63oBvV7Mdm6WaobLbQ7gnPQ": "dSOL",
        "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1": "bSOL",
        "he1iusmfkpAdwvxLNGV8Y1iSbj4rUy6yMhEA3fotn9A": "hSOL",
        "BonK1YhkXEGLZzwtcvRTip3gAL9nCeQD7ppZBLXhtTs": "bonkSOL",
    };
    const logo = addressToNameMap[address] || "unknown";
    return logo.toLowerCase();
}