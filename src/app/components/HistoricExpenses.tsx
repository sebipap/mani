"use client";

import { ChangeEvent, useCallback, useState } from "react";

import { Expense } from "@/app/lib/type";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalize } from "../lib/string";
import { ExpensesTable } from "./ExpensesTable";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Props = {
  expenses: Expense[];
};

export const HistoricExpenses = ({ expenses }: Props) => {
  const [expensesShown, setExpensesShown] = useState<Expense[]>(expenses);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!expenses) return;

      const {
        target: { value },
      } = event;

      if (!value || value === "") {
        setExpensesShown(expenses);
        return;
      }

      const normalizedValue = normalize(value);

      const filteredExpenses = expenses.filter(
        ({ description, category: { name } }) =>
          normalize(description).includes(normalizedValue) ||
          normalize(name).includes(normalizedValue)
      );

      setExpensesShown(filteredExpenses);
    },
    [expenses]
  );

  return (
    <>
      <Input
        className="mt-5"
        onChange={handleInputChange}
        name={"expense-search"}
        placeholder={"Search for a specific spend or category"}
        disabled={!expenses}
      />
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>Details</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>My Share</TableHead>
            <TableHead>My Share (USD)</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Users</TableHead>
          </TableRow>
        </TableHeader>

        <ExpensesTable expenses={expensesShown}></ExpensesTable>
      </Table>
    </>
  );
};
