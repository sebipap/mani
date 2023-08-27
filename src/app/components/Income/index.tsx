"use client";

import { Expense } from "@/app/lib/type";
import { groupByCategoryByMonth, groupByMonth } from "@/app/lib/utils";
import { Input } from "@/components/ui/input";
import { memo, useEffect, useState } from "react";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import { COLORS, CustomTooltip } from "../SpendChart";

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
    .map(([month, durations]) => {
      const now = new Date();

      const isCurrentMonth =
        month === `${now.getMonth() + 1}/${now.getFullYear()}`;

      return {
        name: month,
        instant: durations.instant || 0,
        monthly: durations.monthly || 0,
        yearly: durations.yearly || 0,
        eternal: durations.eternal || 0,
        saved: isCurrentMonth
          ? 0
          : Number(income) -
            ((durations?.instant || 0) +
              (durations?.monthly || 0) +
              (durations?.yearly || 0) +
              (durations?.eternal || 0)),
      };
    })
    .sort((a, b) => {
      const [monthA, yearA] = a.name.split("/");
      const [monthB, yearB] = b.name.split("/");
      return (
        Number(yearA) * 12 +
        Number(monthA) -
        (Number(yearB) * 12 + Number(monthB))
      );
    })
    .splice(-4);

  return (
    <div>
      <h1>Income</h1>
      how much do you make?
      <Input
        value={income}
        onChange={({ target: { value } }) => setIncome(value)}
      />
      <BarChart width={1000} height={400} data={data} key={"name"}>
        <Bar dataKey="instant" fill={COLORS[0]} stackId="a" />
        <Bar dataKey="eternal" fill={COLORS[1]} stackId="a" />
        <Bar dataKey="saved" fill={COLORS[2]} stackId="a" />
        <Bar dataKey="yearly" fill={COLORS[3]} stackId="a" />
        <Bar dataKey="monthly" fill={COLORS[4]} stackId="a" />
        <Tooltip
          content={(x: any) => <CustomTooltip {...{ ...x, currency: "USD" }} />}
          cursor={{ fill: "transparent" }}
        />{" "}
        <XAxis dataKey={"name"} fontSize={12} />
      </BarChart>
    </div>
  );
};

export default memo(Income);
