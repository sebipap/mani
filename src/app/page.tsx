import Expenses from "./components/Expenses";

export default async function Home() {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Expenses />
    </>
  );
}
