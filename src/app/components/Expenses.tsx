import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../api/auth/[...nextauth]/route";
import { fetchUser, getExpenses } from "../lib/splitwise";
import { Expense } from "../lib/type";
import Dashboard from "./Dashboard";
import mockExpenses from "../../mockExpenses.json";

export default async function Expenses() {
  const session = await getServerSession(authOptions);

  const { accessToken } = (session as CustomSession | null) || {
    accessToken: undefined,
  };

  let expenses: Expense[] = mockExpenses.map(({ date, ...rest }) => ({
    ...rest,
    date: new Date(date),
  })) as unknown as Expense[];

  if (accessToken) {
    const user = await fetchUser(accessToken);

    expenses =
      session && accessToken && user.id
        ? await getExpenses(accessToken, user.id)
        : [];
  }

  return <Dashboard expenses={expenses} />;
}
