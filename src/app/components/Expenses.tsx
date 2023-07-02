import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../api/auth/[...nextauth]/route";
import { fetchUser, getExpenses } from "../lib/splitwise";
import { Expense } from "../lib/type";
import Dashboard from "./Dashboard";

export default async function Expenses() {
  const session = await getServerSession(authOptions);

  const { accessToken } = (session as CustomSession | null) || {
    accessToken: undefined,
  };

  let expenses: Expense[] = [];

  if (accessToken) {
    const user = await fetchUser(accessToken);

    expenses =
      session && accessToken && user.id
        ? await getExpenses(accessToken, user.id)
        : [];
  }
  /* @ts-expect-error Server Component */
  return <Dashboard expenses={expenses} />;
}
