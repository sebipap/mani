"use client";
import { Card, Title } from "@tremor/react";
import { Expense } from "../lib/type";

type Props = {
  expenses: Expense[];
};

export const Months = ({ expenses }: Props) => {
  return (
    <>
      <Card>
        <Title>Current Month</Title>
      </Card>
    </>
  );
};
