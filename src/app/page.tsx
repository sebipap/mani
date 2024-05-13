import Expenses from "./components/Expenses";

export default async function Home() {
  /* @ts-expect-error Server Component */
  return <Expenses />;
}
