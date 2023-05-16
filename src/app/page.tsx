import Image from "next/image";
import { SpendChart } from "./components/SpendChart";
import { SpendTable } from "./components/SpendTable";
import { getExpenses } from "@/app/lib/splitwise";

export default async function Home() {
  const expenses = await getExpenses();

  return (
    <div className="flex justify-center align-middle">
      <main className="flex min-h-screen flex-col items-center justify-between max-w-3xl mt-7">
        <SpendChart {...{ expenses }} />
        <SpendTable {...{ expenses }} />
      </main>
    </div>
  );
}
