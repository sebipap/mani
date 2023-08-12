"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Expense, RECURRENT_CATEGORIES } from "../lib/type";
import { Card } from "@/components/ui/card";
import { track } from "../lib/analytics";

type Props = {
  expenses: Expense[];
};

export const RecurrentExpenses = ({ expenses }: Props) => {
  const similarExpenses = (expense: Expense, expenses: Expense[]) => {
    return expenses.filter((x) =>
      expense.description
        .toLowerCase()
        ?.split(" ")
        .filter(Boolean)
        .some((word) =>
          x.description
            .toLowerCase()
            .split(" ")
            .some((x) => x === word)
        )
    );
  };

  const commonName = (expenses: Expense[]) => {
    const words = expenses.flatMap(({ description }) =>
      description.toLowerCase().split(" ").filter(Boolean)
    );

    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(wordCount).sort((a, b) => b[1] - a[1])[0][0];
  };

  const expensesGrouped: Record<string, Expense[]> = {};

  let allExpenses = [...expenses];

  for (const expense of expenses) {
    const groupExpenses = similarExpenses(expense, allExpenses);

    if (groupExpenses.length < 2) continue;

    allExpenses = allExpenses.filter((x) => !groupExpenses.includes(x));

    expensesGrouped[commonName(groupExpenses)] = groupExpenses;
  }

  const monthlyExpenses = Object.fromEntries(
    Object.entries(expensesGrouped).filter(([_, expenses]) => {
      // return false if there are more than one expense per month
      const months = expenses.map((x) => format(new Date(x.date), "MM yy"));
      const onlyOnePerMonth = months.length === new Set(months).size;

      return (
        onlyOnePerMonth &&
        RECURRENT_CATEGORIES.includes(expenses[0].category.id)
      );
    })
  );

  const months = [
    new Date().setMonth(new Date().getMonth()),
    new Date().setMonth(new Date().getMonth() - 1),
    new Date().setMonth(new Date().getMonth() - 2),
  ];

  const subscriptions = Object.entries(monthlyExpenses)
    .sort(
      ([_1, expenses1], [_2, expenses2]) =>
        expenses2[0].cost - expenses1[0].cost
    )
    .map(([str]) => str);
  return (
    <>
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>

            {subscriptions.map((sub) => (
              <TableHead key={sub}>
                {sub[0].toUpperCase()}
                {sub.slice(1)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {months.map((month) => (
            <TableRow key={String(month)}>
              <TableCell>{format(month, "MMMM")}</TableCell>
              {subscriptions.map((sub) => {
                const recurrent = recurrentTxs(expenses, month, sub);
                return (
                  <TableCell key={sub} className={"text-lg"}>
                    {recurrent.length !== 0
                      ? recurrent
                      : Date.now() > month + 31 * 24 * 60 * 60 * 1000
                      ? "❌"
                      : "⏳"}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
function recurrentTxs(expenses: Expense[], month: number, sub: string) {
  return expenses
    .filter((exp) => {
      const isInMonth =
        format(month, "MM yy") === format(new Date(exp.date), "MM yy");

      const isSimilar = exp.description
        .toLowerCase()
        ?.split(" ")
        .filter(Boolean)
        .some((word) => sub.split(" ").some((x) => x === word));

      return isInMonth && isSimilar;
    })
    .map((exp) => (
      <p
        key={exp.id}
        className={"text-lg"}
        onClick={() => {
          track("BUTTON_CLICKED", {
            text: "✅",
            location: "RecurrentExpenses",
            expense: exp.description,
          });
          alert(`
													Description: ${exp.description}
													Cost: ${exp.cost}
													Date: ${format(new Date(exp.date), "dd/MM/yyyy")}	`);
        }}
      >
        ✅
      </p>
    ));
}
