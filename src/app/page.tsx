import { getExpenses } from "@/app/lib/splitwise";
import { ExpensesTiles } from "./components/ExpensesTiles";
import { RecurrentExpenses } from "./components/RecurrentExpenses";
import { SpendChart } from "./components/SpendChart";
import { SpendTable } from "./components/SpendTable";

export default async function Home() {
  const expenses = await getExpenses();

  return (
    <div className="flex justify-center align-middle">
      <main className="flex min-h-screen flex-col items-center justify-between min-w-4 w-[100%] mt-7 max-w-[1000px]">
        <SpendChart {...{ expenses }} />
        <ExpensesTiles {...{ expenses }} />
        <RecurrentExpenses {...{ expenses }} />
        <SpendTable {...{ expenses }} />
      </main>
    </div>
  );
}
