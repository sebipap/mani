import { Currency, Expense } from "@/app/lib/type";

export type BluelyticsReponse = {
  date: Date;
  source: "Oficial" | "Blue";
  value_sell: number;
  value_buy: number;
};

export type Quote = {
  date: Date;
  value: number;
};

export async function fetchARSQuotes(): Promise<Quote[]> {
  const evolution: BluelyticsReponse[] = await fetch(
    "https://api.bluelytics.com.ar/v2/evolution.json"
  ).then((res) => res.json());
  return evolution
    .filter(({ source }) => source === "Blue")
    .map(({ date, value_sell, value_buy }) => ({
      date,
      value: (value_sell + value_buy) / 2,
    }));
}

type OpenExchangeRatesResponse = {
  base: Currency;
  rates: Record<Currency, number>;
  timestamp: number;
};

export async function fetchCurrenciesQuotes(
  currencies: Currency[]
): Promise<Record<Currency, Quote[]>> {
  if (!process.env.OPEN_EXCHANGE_RATES_APP_ID)
    throw new Error("OPEN_EXCHANGE_RATES_APP_ID is not defined");
  const { rates, timestamp } = (await fetch(
    `https://openexchangerates.org/api/latest.json?app_id=${
      process.env.OPEN_EXCHANGE_RATES_APP_ID
    }&base=${"USD"}&symbols=${currencies.join(",")}}`
  ).then((res) => res.json())) as OpenExchangeRatesResponse;
  const date = new Date(timestamp);
  const quotes = Object.fromEntries(
    Object.entries(rates).map(([curr, value]) => [curr, [{ date, value }]])
  );

  return quotes;
}

export async function fetchExchangeRateQuotes(
  currencies: Currency[]
): Promise<Record<Currency, Quote[]>> {
  const currenciesQuotes = await fetchCurrenciesQuotes(currencies);

  if (currencies.includes("ARS")) {
    currenciesQuotes["ARS"] = await fetchARSQuotes();
  }

  return currenciesQuotes;
}

export function convertARStoUSD(
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

export function convertToUSD(
  cost: number,
  date: Date,
  prices: Record<Currency, Quote[]>,
  currencyCode: Currency
) {
  if (currencyCode === "USD") return cost;
  if (currencyCode === "ARS") return convertARStoUSD(cost, date, prices["ARS"]);
  const currencyQuotes = prices[currencyCode];
  if (!currencyQuotes) return undefined;
  const [lastQuote] = currencyQuotes;
  return Number((cost / lastQuote.value).toFixed(2));
}

export async function addUSDPrice(
  expense: Expense,
  prices: Record<Currency, Quote[]>
): Promise<Expense> {
  const { cost, currencyCode, date } = expense;

  const costUSD =
    currencyCode === "USD"
      ? cost
      : convertToUSD(cost, date, prices, currencyCode);

  return { ...expense, costUSD };
}
