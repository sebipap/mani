import { ExpensesTiles } from "./components/ExpensesTiles";
import { SpendChart } from "./components/SpendChart";
import { SpendTable } from "./components/SpendTable";
import { getExpenses } from "@/app/lib/splitwise";

export default async function Home() {
  const expenses = await getExpenses();

  return (
    <div className="flex justify-center align-middle">
      <main className="flex min-h-screen flex-col items-center justify-between min-w-4 w-[100%] mt-7 max-w-[1000px]">
        <SpendChart {...{ expenses }} />
        <SpendTable {...{ expenses }} />
      </main>
    </div>
  );
}
