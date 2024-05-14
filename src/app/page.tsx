import Expenses from "./components/Expenses";

export const maxDuration = 60;

export default async function Home() {
  /* @ts-expect-error Server Component */
  return <Expenses />;
}
