import { Expense } from "../lib/type";
import { groupByCategoryByDay } from "../lib/utils";
import { format, getDay } from "date-fns";
import { useState } from "react";

type Props = {
  expenses: Expense[];
};

export const ExpensesTiles = ({ expenses }: Props) => {
  const totalsPerDay = Object.entries(
    groupByCategoryByDay(expenses, "USD")
  ).map(([date, categoryInsights]) => ({
    date,
    total: categoryInsights.reduce((acc, curr) => acc + curr.total, 0),
  }));
  // render a grid of tiles each one representing a day
  // there are 7 rows, for each day of the week

  const maxExpense = Math.max(...totalsPerDay.map((d) => d.total));

  const logPropotion = (total: number) => {
    const log = Math.log(total);
    const logMax = Math.log(maxExpense);
    return log / logMax;
  };

  const weeks: {
    date: string;
    total: number;
  }[][] = totalsPerDay.reduce(
    (acc, curr, i) => {
      if (i % 7 === 0) {
        acc.push([curr]);
      } else {
        acc[acc.length - 1].push(curr);
      }
      return acc;
    },
    [] as {
      date: string;
      total: number;
    }[][]
  );

  return (
    <div className="tiles flex shadow m-3 p-[6px] border border-gray-800 rounded  z-10 max-w-[100%] overflow-scroll">
      <style>
        {`	
			.tile:hover .tooltip {
				display: block;
			}

      .tooltip {
        font-size: 12px;
      }

			`}
      </style>
      {weeks.map((week, i) => (
        <div key={i}>
          {week.map((day) => (
            <div
              key={day.date}
              style={{
                backgroundColor:
                  day.total === 0
                    ? "transparent"
                    : `hsl(100, 90%, ${100 - logPropotion(day.total) * 100}%`,
              }}
              className="tile w-[12px] rounded-sm h-[12px] m-[2px]"
            >
              <div className="tooltip mt-[16px] bg-slate-800 absolute hidden rounded shadow p-3">
                {format(Number(day.date), "EE dd/MM")}
                <br />
                <strong>${day.total}</strong>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
