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

async function convertARStoUSD(cost: number, date: Date) {
  const prices = await fetchPrices();

  const closestPrice = prices.sort(
    (p1, p2) =>
      new Date(p1.date).getTime() -
      date.getTime() -
      (new Date(p2.date).getTime() - date.getTime())
  )[0];

  return closestPrice.value;
}

export async function addUSDPrice(expense: Expense): Promise<Expense> {
  const { cost, currencyCode, date } = expense;

  const costUSD =
    currencyCode === "USD"
      ? cost
      : currencyCode === "ARS"
      ? await convertARStoUSD(cost, date)
      : undefined;

  return { ...expense, costUSD };
}
