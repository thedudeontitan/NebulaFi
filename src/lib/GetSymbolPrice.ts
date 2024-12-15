import BigNumber from "bignumber.js";

enum PythID {
  BTCUSD = "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  ETHUSD = "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  SOLUSD = "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
  MNTUSD = "0x4e3037c822d852d79af3ac80e35eb420ee3b870dca49f9344a38ef4773fb0585",
}

export const getSymbolPrice = async (symbol: string) => {
  try {
    const pythID = PythID[symbol as keyof typeof PythID];

    if (!pythID) {
      throw new Error(`Invalid symbol: ${symbol}`);
    }

    const res = await fetch(
      `https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=${pythID}`
    );
    const data = await res.json();

    const priceRaw: string = data.parsed[0].price.price;
    const expo: number = data.parsed[0].price.expo;

    const price = new BigNumber(priceRaw);
    let finalPrice: BigNumber;

    if (expo >= 0) {
      finalPrice = price.multipliedBy(new BigNumber(10).pow(expo));
    } else {
      finalPrice = price.dividedBy(new BigNumber(10).pow(-expo));
    }

    const finalPriceString = finalPrice.toFixed();

    return parseFloat(finalPriceString);
  } catch (error) {
    console.error(`Error fetching price for symbol ${symbol}:`, error);
    throw error;
  }
};
