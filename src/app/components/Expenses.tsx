import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../api/auth/[...nextauth]/route";
import { Profile } from "./Profile";
import { fetchUser, getExpenses } from "../lib/splitwise";
import { Chat } from "./Chat";
import { SpendChart } from "./SpendChart";
import { ExpensesTiles } from "./ExpensesTiles";
import { RecurrentExpenses } from "./RecurrentExpenses";
import { HistoricExpenses } from "./HistoricExpenses";

const Expenses = async () => {
  const session = await getServerSession(authOptions);

  const { accessToken } = (session as CustomSession | null) || {
    accessToken: undefined,
  };

  let expenses;

  if (accessToken) {
    const user = await fetchUser(accessToken);

    expenses =
      session && accessToken && user.id
        ? await getExpenses(accessToken, user.id)
        : null;
  }

  return (
    <>
      <Profile />
      {expenses && (
        <>
          <Chat {...{ expenses }} />
          <SpendChart {...{ expenses }} />
          <ExpensesTiles {...{ expenses }} />
          <RecurrentExpenses {...{ expenses }} />
          <HistoricExpenses {...{ expenses }} />
        </>
      )}
    </>
  );
};

export default Expenses;
