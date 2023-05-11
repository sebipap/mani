import Image from "next/image";
import { SpendChart } from "./components/SpendChart";
import { SpendTable } from "./components/SpendTable";
import { getExpenses } from "@/app/lib/splitwise";

export default async function Home() {
  const expenses = await getExpenses();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SpendChart {...{ expenses }} />
      <SpendTable {...{ expenses }} />
    </main>
  );
}
