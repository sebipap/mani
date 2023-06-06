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
  const recurrentExpenses = expenses.filter((exp) => {
    const similarTxs = expenses.filter((e) =>
      e.details?.split(" ").some((words) => exp.details?.includes(words))
    );

    return similarTxs.length > 1;
  });

  const months = [
    new Date().setMonth(new Date().getMonth()),
    new Date().setMonth(new Date().getMonth() - 1),
    new Date().setMonth(new Date().getMonth() - 2),
    new Date().setMonth(new Date().getMonth() - 3),
    new Date().setMonth(new Date().getMonth() - 4),
  ];

  return (
    <Card>
      <Title>Recurring Expenses</Title>
      <Table className="mt-5">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Month</TableHeaderCell>

            {subscriptions.map((sub) => (
              <TableHeaderCell key={sub.name}>{sub.name}</TableHeaderCell>
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

      if (isSimilar) {
        console.log(exp.description, sub.name, exp.description?.split(" "));
      }

      return isInMonth && isSimilar;
    })
    .map((exp) => (
      <p
        key={exp.id}
        onClick={() =>
          alert(`
													Description: ${exp.description}
													Cost: ${exp.cost}
													Date: ${format(new Date(exp.created_at), "dd/MM/yyyy")}	`)
        }
      >
        ✅
      </p>
    ));
}
