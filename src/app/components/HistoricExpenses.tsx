"use client";

import { ChangeEvent, useCallback, useState } from "react";

import { Expense } from "@/app/lib/type";

import {
  Card,
  Table,
  TableHead,
  TableHeaderCell,
  TableRow,
  TextInput,
  Title,
} from "@tremor/react";
import { normalize } from "../lib/string";
import { ExpensesTable } from "./ExpensesTable";

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
    <Card>
      <Title>Last Spendings</Title>
      <TextInput
        className="mt-5"
        onChange={handleInputChange}
        name={"expense-search"}
        placeholder={"Search for a specific spend or category"}
        disabled={!expenses}
      />
      <Table className="mt-5">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Details</TableHeaderCell>
            <TableHeaderCell>Cost</TableHeaderCell>
            <TableHeaderCell>My Share</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Users</TableHeaderCell>
          </TableRow>
        </TableHead>

        <ExpensesTable expenses={expensesShown}></ExpensesTable>
      </Table>
    </Card>
  );
};
