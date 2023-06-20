"use client";

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import { format } from "date-fns";
import { Expense } from "../lib/type";

type Props = {
  expenses: Expense[];
};

const subscriptions = [
  { name: "alquiler", expiration: 5 },
  { name: "edenor", expiration: 18 },
  { name: "metrogas", expiration: 8 },
  { name: "expensas", expiration: 20 },
  { name: "telecentro", expiration: 10 },
];

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
    Object.entries(expensesGrouped).filter(([name, expenses]) => {
      // return false if there are more than one expense per month
      const months = expenses.map((x) => format(new Date(x.date), "MM yy"));
      if (name === "alquiler") {
        console.log({ months });
      }
      const onlyOnePerMonth = months.length === new Set(months).size;

      return onlyOnePerMonth && ![12, 13].includes(expenses[0].category.id);
    })
  );

  const months = [
    new Date().setMonth(new Date().getMonth()),
    new Date().setMonth(new Date().getMonth() - 1),
    new Date().setMonth(new Date().getMonth() - 2),
  ];

  return (
    <Card>
      <Title>Recurring Expenses</Title>
      {Object.keys(monthlyExpenses).map((key) => (
        <li key={key}>{key}</li>
      ))}
      <Table className="mt-5">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Month</TableHeaderCell>

            {subscriptions.map((sub) => (
              <TableHeaderCell key={sub.name}>
                {sub.name[0].toUpperCase()}
                {sub.name.slice(1)}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {months.map((month) => (
            <TableRow key={String(month)}>
              <TableCell>{format(month, "MMMM")}</TableCell>
              {subscriptions.map((sub) => {
                const recurrent = recurrentTxs(expenses, month, sub);
                return (
                  <TableCell key={sub.name}>
                    {recurrent.length !== 0
                      ? recurrent
                      : Date.now() >
                        month + sub.expiration * 24 * 60 * 60 * 1000
                      ? "❌"
                      : "⏳"}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
function recurrentTxs(
  expenses: Expense[],
  month: number,
  sub: { name: string; expiration: number }
) {
  return expenses
    .filter((exp) => {
      const isInMonth =
        format(month, "MM yy") === format(new Date(exp.date), "MM yy");

      const isSimilar = exp.description
        .toLowerCase()
        ?.split(" ")
        .filter(Boolean)
        .some((word) => sub.name.split(" ").some((x) => x === word));

      return isInMonth && isSimilar;
    })
    .map((exp) => (
      <p
        key={exp.id}
        onClick={() =>
          alert(`
													Description: ${exp.description}
													Cost: ${exp.cost}
													Date: ${format(new Date(exp.date), "dd/MM/yyyy")}	`)
        }
      >
        ✅
      </p>
    ));
}
