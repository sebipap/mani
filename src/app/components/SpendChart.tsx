"use client";
import {
  BarChart,
  Bold,
  Card,
  DateRangePicker,
  DateRangePickerValue,
  Divider,
  DonutChart,
  Flex,
  List,
  ListItem,
  Metric,
  MultiSelectBox,
  MultiSelectBoxItem,
  Text,
  Title,
  Toggle,
  ToggleItem,
} from "@tremor/react";

import { ChartPieIcon, ViewListIcon } from "@heroicons/react/outline";

import { CategoryInsights, Expense, splitwiseCategories } from "@/app/lib/type";
import {
  formatDate,
  groupByCategory,
  groupByCategoryByDay,
  groupByCategoryByWeek,
} from "@/app/lib/utils";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { useState } from "react";

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;

type Props = {
  expenses: Expense[];
};

const colors = [
  "lime",
  "violet",
  "teal",
  "cyan",
  "amber",
  "orange",
  "purple",
  "indigo",
  "blue",
  "emerald",
  "fuchsia",
  "yellow",
  "red",
  "sky",
  "pink",
  "rose",
  "gray",
  "stone",
  "green",
  "zinc",
  "neutral",
  "slate",
] as const;

export const SpendChart = ({ expenses }: Props) => {
  const [dateRange, setDateRange] = useState<DateRangePickerValue>([
    new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    new Date(),
  ]);

  const [minDate, maxDate] = dateRange;

  const [selectedView, setSelectedView] = useState("chart");

  const [groupedBy, setGroupedBy] = useState<"day" | "week">("day");

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    splitwiseCategories.filter((c) => c !== "18")
  );

  const users = expenses
    .flatMap(({ users }) => users)
    .filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj.user.id).indexOf(obj.user.id) === pos;
    });

  const expensesFilteredByDate = expenses.filter(
    ({ created_at }) =>
      !minDate ||
      !maxDate ||
      (created_at >= minDate.toISOString() &&
        created_at <= maxDate.toISOString())
  );

  const expensesFilteredByCategory = expensesFilteredByDate.filter(
    ({ category }) =>
      !selectedCategories ||
      selectedCategories.length === 0 ||
      selectedCategories.includes(String(category.id))
  );

  const categoryInsights: CategoryInsights[] = groupByCategory(
    expensesFilteredByCategory
  );

  const categoryInsightsByDay = groupByCategoryByDay(
    expensesFilteredByCategory
  );

  const categoryInsightsByWeek = groupByCategoryByWeek(
    expensesFilteredByCategory
  );

  const allCategories = expenses
    .map(({ category }) => category)
    .filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj.id).indexOf(obj.id) === pos;
    });

  const total = categoryInsights.reduce((acc, { total }) => acc + total, 0);

  const now = new Date();

  // array of objects containing text prop with the name of the month
  // and a minDate and maxDate props with the start and end of the month
  // of that month in the current year
  const monthRanges = Array.from({ length: 12 })
    .map((_, index) => now.getMonth() - index || now.getMonth() - index + 12)
    .map((monthIndex) => {
      const month = monthIndex;
      const year = now.getFullYear();
      const startDate = startOfMonth(new Date(year, month, 1));
      const endDate = endOfMonth(new Date(year, month, 1));
      return {
        text: new Intl.DateTimeFormat("en-US", { month: "long" }).format(
          startDate
        ),
        startDate,
        endDate,
        value: month.toString(),
      };
    });

  const lastXDays = (days: number) => ({
    text: `Last ${days} days`,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * days),
    endDate: new Date(),
    value: `last${days}Days`,
  });

  // last monday to sunday perdiod
  const lastWeek = {
    text: "Last week",
    startDate: startOfWeek(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)),
    endDate: endOfWeek(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)),
    value: "lastWeek",
  };

  const dateRangeOptions = [
    lastXDays(7),
    lastWeek,
    lastXDays(30),
    ...monthRanges,
  ];

  return (
    <Card className="mx-auto">
      <Flex className="space-x-8" justifyContent="between" alignItems="center">
        <Title>Overview</Title>

        <Toggle
          defaultValue="chart"
          color="gray"
          onValueChange={(value) => setSelectedView(value)}
        >
          <ToggleItem value="chart" icon={ChartPieIcon} />
          <ToggleItem value="list" icon={ViewListIcon} />
        </Toggle>
      </Flex>
      <Flex alignItems="center">
        <div>
          <Text className="mt-8">Total</Text>
          <Metric>{valueFormatter(total)}</Metric>
        </div>
      </Flex>
      <Divider />
      <Flex style={{ flexWrap: "wrap" }} className="gap-2">
        <DateRangePicker
          className="max-w-md mx-auto"
          value={dateRange}
          onValueChange={setDateRange}
          dropdownPlaceholder="Seleccionar"
          options={dateRangeOptions}
          style={{ flex: 1 }}
        />
        <MultiSelectBox
          value={selectedCategories}
          onValueChange={setSelectedCategories}
          style={{ flex: 1 }}
        >
          {allCategories.map(({ name, id }) => (
            <MultiSelectBoxItem key={id} value={id.toString()} text={name} />
          ))}
        </MultiSelectBox>
      </Flex>

      {selectedView === "chart" ? (
        <>
          <DonutChart
            data={categoryInsights}
            category="total"
            index="name"
            valueFormatter={valueFormatter}
            className="mt-6 w-full h-64"
            showLabel
            colors={[...colors]}
            showAnimation={false}
          />

          <Toggle
            defaultValue="day"
            onValueChange={setGroupedBy as (v: string) => void}
          >
            <ToggleItem value="day" text="Day" />
            <ToggleItem value="week" text="Week" />
          </Toggle>

          <BarChart
            className="mt-6"
            data={Object.entries(
              groupedBy === "day"
                ? categoryInsightsByDay
                : categoryInsightsByWeek
            ).flatMap(([date, categories]) => ({
              name: formatDate(Number(date)),
              ...Object.fromEntries(
                categories.map(({ name, total }) => [name, total])
              ),
            }))}
            index="name"
            categories={allCategories.map(({ name }) => name)}
            colors={[...colors]}
            valueFormatter={valueFormatter}
            stack
          />
        </>
      ) : (
        <>
          <Flex className="mt-8" justifyContent="between">
            <Text className="truncate">
              <Bold>Stocks</Bold>
            </Text>
            <Text>Since transaction</Text>
          </Flex>
          <List className="mt-4">
            {categoryInsights.map((category) => (
              <ListItem key={category.name}>
                <Text>{category.name}</Text>
                <Flex justifyContent="end" className="space-x-2">
                  <Text>
                    ${" "}
                    {Intl.NumberFormat("us").format(category.total).toString()}
                  </Text>
                </Flex>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Card>
  );
};
