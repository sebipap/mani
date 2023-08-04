"use client";

import { Expense } from "@/app/lib/type";
import { groupByCategoryByMonth, groupByMonth } from "@/app/lib/utils";
import { Input } from "@/components/ui/input";
import { memo, useEffect, useState } from "react";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
  expenses: Expense[];
};

const Income = ({ expenses }: Props) => {
  const [income, setIncome] = useState("");

  // save income in localstorage

  useEffect(() => {
    const income = localStorage.getItem("income");
    if (income) {
      setIncome(income);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("income", income);
  }, [income]);

  const months = groupByMonth(expenses, "USD");

  const data = Object.entries(months)
    .map(([month, total]) => ({
      name: month,
      spent: total,
      saved: Number(income) - total,
    }))
    .sort((a, b) => {
      const [monthA, yearA] = a.name.split("/");
      const [monthB, yearB] = b.name.split("/");
      return (
        Number(yearA) * 12 +
        Number(monthA) -
        (Number(yearB) * 12 + Number(monthB))
      );
    })
    .splice(-5);

  return (
    <div>
      <h1>Income</h1>
      how much do you make?
      <Input
        value={income}
        onChange={({ target: { value } }) => setIncome(value)}
      />
      <BarChart width={1000} height={400} data={data} key={"name"}>
        <Bar dataKey="spent" fill="#8884d8" stackId="a" />
        <Bar dataKey="saved" fill="#00ff33" stackId="a" />

        <Tooltip />
        <XAxis dataKey={"name"} fontSize={12} />
        <YAxis dataKey={"spent"} fontSize={12} />
      </BarChart>
    </div>
  );
};

export default memo(Income);
