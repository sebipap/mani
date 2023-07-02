"use client";
import { BarChart } from "@tremor/react";

import { CategoryInsight, Expense } from "@/app/lib/type";
import {
  formatDate,
  groupByCategory,
  groupByCategoryByDay,
  groupByCategoryByWeek,
} from "@/app/lib/utils";
import { endOfDay, isSameDay, isSameWeek } from "date-fns";
import { useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range";

import { PieChart, Pie, Cell } from "recharts";
import { DateRange } from "react-day-picker";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;

type Props = {
  expenses: Expense[];
};

export const COLORS = [
  "#fd7f6f",
  "#7eb0d5",
  "#b2e061",
  "#bd7ebe",
  "#ffb55a",
  "#ffee65",
  "#beb9db",
  "#fdcce5",
  "#8bd3c7",
] as const;

export const SpendChart = ({ expenses }: Props) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    to: new Date(),
  });

  const { from: minDate, to: maxDate } = dateRange || {};
  const [groupedBy, setGroupedBy] = useState<"day" | "week" | "total">("day");
  const [category, setCategory] = useState<string>("all");

  const users = expenses
    .flatMap(({ users }) => users)
    .filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj.user.id).indexOf(obj.user.id) === pos;
    });

  const expensesFilteredByDate = expenses.filter(
    ({ date }) => !minDate || !maxDate || (date >= minDate && date <= maxDate)
  );

  const allCategories = expenses
    .map(({ category }) => category)
    .filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj.id).indexOf(obj.id) === pos;
    });

  const categoryIdsWithoutGeneral = allCategories
    .filter(({ id }) => id !== 18)
    .map(({ id }) => String(id));

  const selectedCategories =
    category === "all" ? categoryIdsWithoutGeneral : [category];

  const expensesFilteredByCategory = expensesFilteredByDate.filter(
    ({ category }) =>
      !selectedCategories ||
      selectedCategories.length === 0 ||
      selectedCategories.includes(String(category.id))
  );

  const categoryInsights: CategoryInsight[] = groupByCategory(
    expensesFilteredByCategory
  );

  const categoryInsightsByDay = groupByCategoryByDay(
    expensesFilteredByCategory
  );

  const categoryInsightsByWeek = groupByCategoryByWeek(
    expensesFilteredByCategory
  );

  const sum = categoryInsights.reduce((acc, { total }) => acc + total, 0);

  return (
    <>
      <div className="gap-2 flex flex-wrap w-[100%]">
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="max-h-[350px]">
            <SelectItem value={"all"}>All</SelectItem>
            {allCategories.map(({ name, id }) => (
              <SelectItem key={id} value={id.toString()}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={groupedBy}
          onValueChange={(value: "day" | "week" | "total") =>
            setGroupedBy(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"day"}>Day</SelectItem>
            <SelectItem value={"week"}>Week</SelectItem>
            <SelectItem value={"total"}>Total</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {groupedBy === "total" ? (
        <div className="flex">
          <PieChart width={400} height={400} cx="50%" cy="50%">
            <Pie
              animationDuration={400}
              data={categoryInsights}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              innerRadius={80}
              fillRule="evenodd"
              color="#8884d8"
              stroke="none"
            >
              {categoryInsights.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.id % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>

          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>{formatPrice(sum)}</TableCell>
              </TableRow>

              {categoryInsights.map(({ name, total, id }, index) => (
                <TableRow key={name}>
                  <TableCell>
                    <Badge
                      style={{ backgroundColor: COLORS[id % COLORS.length] }}
                    >
                      {name}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatPrice(total)}</TableCell>
                  <TableCell>{Math.round((total / sum) * 100)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <BarChart
          className="mt-6"
          data={Object.entries(
            groupedBy === "day" ? categoryInsightsByDay : categoryInsightsByWeek
          ).flatMap(([date, categories]) => {
            const isToday = isSameDay(Number(date), Date.now());
            const isThisWeek = isSameWeek(Number(date), Date.now(), {
              weekStartsOn: 1,
            });
            const name =
              groupedBy == "day" && isToday
                ? "Today"
                : groupedBy == "week" && isThisWeek
                ? "This week"
                : formatDate(Number(date));
            return {
              name,
              ...Object.fromEntries(
                categories.map(({ name, total }) => [name, total])
              ),
            };
          })}
          index="name"
          categories={allCategories.map(({ name }) => name)}
          valueFormatter={valueFormatter}
          stack
          showLegend={false}
        />
      )}
    </>
  );
};
