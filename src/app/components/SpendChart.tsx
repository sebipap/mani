"use client";

import { CategoryInsight, Currency, Expense } from "@/app/lib/type";
import {
  formatDate,
  groupByCategory,
  groupByCategoryByDay,
  groupByCategoryByMonth,
  groupByCategoryByWeek,
} from "@/app/lib/utils";
import { isSameDay, isSameWeek } from "date-fns";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Tooltip,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { DateRange } from "react-day-picker";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

type CTProps = {
  active?: boolean;
  payload: {
    fill: string;
    value: string;
    dataKey: string;
    name: string;
    payload: Record<string, number>;
  }[];
  label: string;
  currency: Currency;
};

export const CustomTooltip = ({
  active,
  payload,
  label,
  currency,
}: CTProps) => {
  return active && payload && payload.length ? (
    <div className="bg-black rounded-lg p-1 max-h-[400px] overflow-x-scroll z-10 ">
      <style>
        {`  .recharts-text.recharts-cartesian-axis-tick-value > tspan {
        font-size: 10px;
      }`}
      </style>
      <p className="m-2">{label}</p>
      <div className="flex flex-col ">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell className="m-0">
                {formatPrice(
                  payload.reduce((acc, pld) => acc + Number(pld.value), 0),
                  currency
                )}
              </TableCell>
            </TableRow>
            {payload
              .sort((p1, p2) => Number(p2.value) - Number(p1.value))
              .map((pld) => (
                <TableRow key={pld.dataKey}>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor: pld.fill,
                      }}
                    >
                      {pld.dataKey}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatPrice(Number(pld.value), currency)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ) : null;
};

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
    from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    to: new Date(),
  });

  const { from: minDate, to: maxDate } = dateRange || {};
  const [groupedBy, setGroupedBy] = useState<
    "day" | "week" | "month" | "total"
  >("total");
  const [category, setCategory] = useState<string>("all");
  const [currency, setCurrency] = useState<Currency>("USD");

  const expensesFilteredByDate = expenses.filter(
    ({ date }) => !minDate || !maxDate || (date >= minDate && date <= maxDate)
  );

  const timePeriod = (maxDate?.getTime() || 0) - (minDate?.getTime() || 0);

  const expensesPreviousPeriod = expenses.filter(
    ({ date }) =>
      !minDate ||
      (date < minDate && date >= new Date(minDate.getTime() - timePeriod))
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
    expensesFilteredByCategory,
    currency
  );

  const previousCategoryInsights: CategoryInsight[] = groupByCategory(
    expensesPreviousPeriod.filter(
      ({ category }) =>
        !selectedCategories ||
        selectedCategories.length === 0 ||
        selectedCategories.includes(String(category.id))
    ),
    currency
  );

  const categoryInsightsByDay = groupByCategoryByDay(
    expensesFilteredByCategory,
    currency
  );

  const categoryInsightsByWeek = groupByCategoryByWeek(
    expensesFilteredByCategory,
    currency
  );

  const categoryInsightsByMonth = groupByCategoryByMonth(
    expensesFilteredByCategory,
    currency
  );

  const sum = categoryInsights.reduce((acc, { total }) => acc + total, 0);
  const prevSum = previousCategoryInsights.reduce(
    (acc, { total }) => acc + total,
    0
  );

  const barChartData = Object.entries(
    groupedBy === "day"
      ? categoryInsightsByDay
      : groupedBy === "week"
      ? categoryInsightsByWeek
      : categoryInsightsByMonth
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
        : groupedBy === "month"
        ? new Date(Number(date)).getMonth() + 1
        : formatDate(Number(date));

    const x = Object.fromEntries(
      categories.map(({ name, total }) => [name, total])
    );
    return {
      name,
      ...x,
    };
  });

  const sumIncrement = prevSum
    ? Math.round(((sum - prevSum) / prevSum) * 100)
    : undefined;

  return (
    <>
      <div className="gap-2 flex flex-nowrap w-[100%]">
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
          value={currency}
          onValueChange={setCurrency as (value: string) => void}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent className="max-h-[350px]">
            {[
              ...new Set([
                ...expenses.map(({ currencyCode }) => currencyCode),
                "USD",
              ]),
            ].map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={groupedBy}
          onValueChange={(value: "day" | "week" | "month" | "total") =>
            setGroupedBy(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"day"}>Day</SelectItem>
            <SelectItem value={"week"}>Week</SelectItem>
            <SelectItem value={"month"}>Month</SelectItem>
            <SelectItem value={"total"}>Total</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="p-5 ">
        {groupedBy === "total" ? (
          <div className="flex">
            <PieChart width={300} height={300} cx="50%" cy="50%">
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
            <div className="max-h-[300px] overflow-scroll ">
              <Table>
                <TableBody>
                  {categoryInsights.map(({ name, total, id }) => {
                    const prevTotal = previousCategoryInsights.find(
                      ({ id: prevId }) => prevId === id
                    )?.total;

                    const incrementFromLastPeriod = prevTotal
                      ? Math.round(((total - prevTotal) / prevTotal) * 100)
                      : undefined;

                    return (
                      <TableRow key={name}>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor: COLORS[id % COLORS.length],
                            }}
                          >
                            {name}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatPrice(total, currency)}</TableCell>
                        <TableCell>
                          {sum ? Math.round((total / sum) * 100) : "-"}%
                        </TableCell>
                        {incrementFromLastPeriod && (
                          <TableCell className="whitespace-nowrap flex-nowrap">
                            {incrementFromLastPeriod > 0 ? "▲" : "▼"}{" "}
                            {incrementFromLastPeriod}%
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell>{formatPrice(sum, currency)}</TableCell>
                    <TableCell></TableCell>
                    {sumIncrement &&
                      (sumIncrement > 0 ? (
                        <TableCell className="whitespace-nowrap flex-nowrap">
                          ▲ {sumIncrement}%
                        </TableCell>
                      ) : (
                        <TableCell className="whitespace-nowrap flex-nowrap">
                          ▼ {sumIncrement}%
                        </TableCell>
                      ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <>
            {/* ____________ */}
            <ResponsiveContainer width={"100%"} height={300}>
              <BarChart
                className="mt-6"
                data={barChartData}
                width={500}
                height={300}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <Tooltip
                  content={(x: any) => (
                    <CustomTooltip {...{ ...x, currency }} />
                  )}
                  cursor={{ fill: "transparent" }}
                />

                <XAxis dataKey={"name"} fontSize={12} />
                {allCategories.map(({ name, id }) => (
                  <Bar
                    dataKey={name}
                    stackId="a"
                    key={name}
                    fill={COLORS[id % COLORS.length]}
                    name={"name"}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </>
  );
};
