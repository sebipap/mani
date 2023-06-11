import { getExpenses } from "@/app/lib/splitwise";
import { Chat } from "./components/Chat";
import { ExpensesTiles } from "./components/ExpensesTiles";
import { HistoricExpenses } from "./components/HistoricExpenses";
import { Months } from "./components/Months";
import { RecurrentExpenses } from "./components/RecurrentExpenses";
import { SpendChart } from "./components/SpendChart";

export default async function Home() {
  const expenses = (await getExpenses()).filter(
    ({ deleted_at }) => !deleted_at
  );

  return (
    <div className="flex justify-center align-middle">
      <main className="flex min-h-screen flex-col items-center justify-between min-w-4 w-[100%] mt-7 max-w-[1000px] gap-3 p-4">
        <Months {...{ expenses }} />
        <Chat {...{ expenses }} />
        <SpendChart {...{ expenses }} />
        <ExpensesTiles {...{ expenses }} />
        <RecurrentExpenses {...{ expenses }} />
        <HistoricExpenses {...{ expenses }} />
      </main>
    </div>
  );
}
