import { startOfWeek } from "date-fns";
import {
  CategoryInsight,
  ConsumptionDuration,
  Currency,
  Expense,
  categoriesConsumption,
} from "./type";

export function groupByCategory(
  expenses: Expense[],
  currency: Currency
): CategoryInsight[] {
  const categoryIds = [
    ...new Set(expenses.map((expense) => expense.category.id)),
  ];

  const categoryInsights = categoryIds.map((categoryId) => ({
    id: categoryId,
    name:
      expenses.find((expense) => expense.category.id === categoryId)?.category
        .name || "",
    total: expenses
      .filter((expense) => expense.category.id === categoryId)
      .filter(
        ({ currencyCode }) => currency === "USD" || currencyCode === currency
      )
      .reduce(
        (acc, expense) =>
          acc + (expense[currency === "USD" ? "costUSD" : "cost"] || 0),
        0
      ),
    currency_code:
      expenses.find((expense) => expense.category.id === categoryId)
        ?.currencyCode || "",
  }));

  return categoryInsights.sort((a, b) => b.total - a.total);
}

export function groupByCategoryByDay(
  expenses: Expense[],
  currency: Currency
): Record<number, CategoryInsight[]> {
  const expensesByDay: Record<number, Expense[]> = expenses.reduce(
    (acc, expense) => {
      const date = new Date(expense.date);
      const day = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).getTime();
      return {
        ...acc,
        [day]: [...(acc[day] || []), expense],
      };
    },
    {} as Record<number, Expense[]>
  );

  const expByDay = Object.entries(expensesByDay).reduce(
    (acc, [day, expenses]) => ({
      ...acc,
      [Number(day)]: groupByCategory(expenses, currency),
    }),
    {} as Record<number, CategoryInsight[]>
  );

  // fill days with no expenses

  const firstDay = Number(
    Object.keys(expByDay)[Object.keys(expByDay).length - 1]
  );
  const lastDay = Number(Object.keys(expByDay)[0]);

  const days = [];
  for (let day = firstDay; day <= lastDay; day += 1000 * 60 * 60 * 24) {
    days.push(day);
  }

  return days.reduce(
    (acc, day) => ({
      ...acc,
      [day]: expByDay[day] || [],
    }),
    {} as Record<number, CategoryInsight[]>
  );
}

export function groupByCategoryByWeek(
  expenses: Expense[],
  currency: Currency
): Record<number, CategoryInsight[]> {
  const weeks: Record<number, CategoryInsight[]> = {};

  for (const [day, dayInsights] of Object.entries(
    groupByCategoryByDay(expenses, currency)
  )) {
    const weekStart = startOfWeek(new Date(Number(day)), {
      weekStartsOn: 1,
    }).getTime();

    if (weeks[weekStart] === undefined) {
      weeks[weekStart] = dayInsights;
      continue;
    }

    for (const { id, total, ...rest } of dayInsights) {
      const weekInsights = weeks[weekStart];

      const weekCategoryInsight = weekInsights.find(
        (weekInsight) => weekInsight.id === id
      );

      if (weekCategoryInsight === undefined) {
        weeks[weekStart].push({ id, total, ...rest });
        continue;
      }

      weekCategoryInsight.total += total;
    }
  }

  return weeks;
}

export function groupByCategoryByMonth(
  expenses: Expense[],
  currency: Currency
): Record<number, CategoryInsight[]> {
  const months: Record<number, CategoryInsight[]> = {};

  for (const [day, dayInsights] of Object.entries(
    groupByCategoryByDay(expenses, currency)
  )) {
    const date = new Date(Number(day));
    const month = new Date(date.getFullYear(), date.getMonth()).getTime();

    if (months[month] === undefined) {
      months[month] = dayInsights;
      continue;
    }

    for (const { id, total, ...rest } of dayInsights) {
      const monthInsights = months[month];

      const monthCategoryInsight = monthInsights.find(
        (monthInsight) => monthInsight.id === id
      );

      if (monthCategoryInsight === undefined) {
        months[month].push({ id, total, ...rest });
        continue;
      }

      monthCategoryInsight.total += total;
    }
  }

  return months;
}

export function groupByMonth(expenses: Expense[], currency: Currency) {
  return expenses.reduce((months, expense) => {
    const monthString = `${
      expense.date.getMonth() + 1
    }/${expense.date.getFullYear()}`;
    const duration = categoriesConsumption[expense.category.id];
    const newTotal =
      (months[monthString]?.[duration] || 0) +
      ((currency === "USD" ? expense?.costUSD : expense?.cost) || 0);
    months[monthString] = { ...months[monthString], [duration]: newTotal };
    return months;
  }, {} as Record<string, Record<ConsumptionDuration, number>>);
}

// example: Friday May 3
export function formatDate(date: number): string {
  const dateObj = new Date(date);
  return `${dateObj.toLocaleDateString("en-US", {
    weekday: "long",
  })} ${dateObj.toLocaleDateString("en-US", {
    month: "long",
  })} ${dateObj.getDate()}`;
}

export function isExpense(thing: any): thing is Expense {
  if (!thing) return false;

  return (
    thing.hasOwnProperty("id") &&
    thing.hasOwnProperty("cost") &&
    thing.hasOwnProperty("date") &&
    thing.hasOwnProperty("description") &&
    thing.hasOwnProperty("category") &&
    thing.hasOwnProperty("repayments")
  );
}
