import { Expense } from "@/app/lib/type";

export type QuoteResponse = {
  date: Date;
  source: "Oficial" | "Blue";
  value_sell: number;
  value_buy: number;
};

export async function fetchPrices() {
  const evolution: QuoteResponse[] = await fetch(
    "https://api.bluelytics.com.ar/v2/evolution.json"
  ).then((res) => res.json());
  return evolution
    .filter(({ source }) => source === "Blue")
    .map(({ date, value_sell, value_buy }) => ({
      date,
      value: (value_sell + value_buy) / 2,
    }));
}

export async function convertARStoUSD(
  cost: number,
  date: Date,
  prices: { date: Date; value: number }[]
) {
  const closestPrice = prices.sort((p1, p2) => {
    const priceDate1 = new Date(p1.date);
    const priceDate2 = new Date(p2.date);
    const diff1 = Math.abs(priceDate1.getTime() - date.getTime());
    const diff2 = Math.abs(priceDate2.getTime() - date.getTime());
    return diff1 - diff2;
  })[0];

  return Number((cost / closestPrice?.value).toFixed(2));
}

export async function addUSDPrice(
  expense: Expense,
  prices: { date: Date; value: number }[]
): Promise<Expense> {
  const { cost, currencyCode, date } = expense;

  const costUSD =
    currencyCode === "USD"
      ? cost
      : currencyCode === "ARS"
      ? await convertARStoUSD(cost, date, prices)
      : undefined;

  return { ...expense, costUSD };
}
